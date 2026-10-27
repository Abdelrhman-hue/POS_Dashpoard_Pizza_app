"use server";

import { prisma } from "@/utils/prisma";
import { auth } from "@/auth";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { stripe } from "@/utils/stripe";
import type Stripe from "stripe";

const createOrderSchema = z.object({
  email: z.string().email("Please provide a valid email address"),
  phone: z.string().min(6, "Phone number is required"),
  streetAddress: z.string().min(3, "Street address is required"),
  city: z.string().min(2, "City is required"),
  postalCode: z.string().min(2, "Postal code is required"),
  country: z.string().min(2, "Country is required"),
  items: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.number().int().positive(),
        unitPrice: z.number().positive(),
      })
    )
    .min(1, "At least one item is required in the order"),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;

export async function createOrderAction(data: CreateOrderInput) {
  try {
    const valid = createOrderSchema.safeParse(data);
    if (!valid.success) {
      return {
        success: false as const,
        message: valid.error.issues[0]?.message || "Validation failed",
      };
    }

    const { email, phone, streetAddress, city, postalCode, country, items } =
      valid.data;

    // Get current session if user is logged in
    const session = await auth();
    const currentUserId = session?.user?.id || null;

    // Recalculate totals server-side
    const subTotal = Number(
      items
        .reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
        .toFixed(2)
    );
    const deliveryFee = subTotal >= 50 ? 0 : 5;
    const totalPrice = Number((subTotal + deliveryFee).toFixed(2));

    // Create Order and OrderProducts
    const newOrder = await prisma.order.create({
      data: {
        userEmail: email,
        phone,
        streetAddress,
        city,
        postalCode,
        country,
        subTotal,
        deliveryFee,
        totalPrice,
        paid: false,
        products: {
          create: items.map((item) => ({
            quantity: item.quantity,
            productId: item.productId,
            userId: currentUserId,
          })),
        },
      },
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },
    });

    // Update user profile address info if missing
    if (currentUserId) {
      await prisma.user.update({
        where: { id: currentUserId },
        data: {
          phone,
          streetAddress,
          city,
          postalCode,
          country,
        },
      });
    }

    revalidatePath("/admin");
    revalidatePath("/admin/orders");
    revalidatePath("/profile");

    return {
      success: true as const,
      orderId: newOrder.id,
      message: "Order placed successfully!",
    };
  } catch (error) {
    console.error("Error creating order:", error);
    return {
      success: false as const,
      message: "Failed to place your order. Please try again.",
    };
  }
}

export async function createStripeSessionAction(orderId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        products: {
          include: { product: true },
        },
      },
    });

    if (!order) {
      return { success: false as const, message: "Order not found" };
    }

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] =
      order.products.map((item) => ({
        quantity: item.quantity,
        price_data: {
          currency: "usd",
          product_data: {
            name: item.product.name,
            images:
              item.product.image && item.product.image.startsWith("http")
                ? [item.product.image]
                : [],
            description: item.product.description
              ? item.product.description.slice(0, 150)
              : undefined,
          },
          unit_amount: Math.round(item.product.basePrice * 100),
        },
      }));

    if (order.deliveryFee > 0) {
      line_items.push({
        quantity: 1,
        price_data: {
          currency: "usd",
          product_data: {
            name: "Delivery Fee",
            description: "Standard Doorstep Delivery",
          },
          unit_amount: Math.round(order.deliveryFee * 100),
        },
      });
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: order.userEmail,
      client_reference_id: order.id,
      metadata: {
        orderId: order.id,
      },
      line_items,
      success_url: `${baseUrl}/orders/${order.id}?session_id={CHECKOUT_SESSION_ID}&payment=success`,
      cancel_url: `${baseUrl}/cart?payment=cancelled&order_id=${order.id}`,
    });

    return {
      success: true as const,
      url: checkoutSession.url,
      sessionId: checkoutSession.id,
    };
  } catch (error: unknown) {
    console.error("Stripe Checkout Session Error:", error);
    return {
      success: false as const,
      message:
        (error as Error).message || "Failed to initialize Stripe payment",
    };
  }
}

export async function toggleOrderPaidAction(orderId: string) {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return { success: false, message: "Unauthorized: Admins only" };
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { paid: true },
    });

    if (!order) {
      return { success: false, message: "Order not found" };
    }

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: { paid: !order.paid },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/orders");
    revalidatePath(`/orders/${orderId}`);

    return {
      success: true,
      paid: updated.paid,
      message: updated.paid ? "Order marked as paid" : "Order marked as unpaid",
    };
  } catch (error) {
    console.error("Error toggling order paid status:", error);
    return { success: false, message: "Failed to update order status" };
  }
}

export async function deleteOrderAction(orderId: string) {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return { success: false, message: "Unauthorized: Admins only" };
    }

    // Delete associated OrderProducts first
    await prisma.orderProduct.deleteMany({
      where: { orderId },
    });

    await prisma.order.delete({
      where: { id: orderId },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/orders");

    return { success: true, message: "Order deleted successfully" };
  } catch (error) {
    console.error("Error deleting order:", error);
    return { success: false, message: "Failed to delete order" };
  }
}
