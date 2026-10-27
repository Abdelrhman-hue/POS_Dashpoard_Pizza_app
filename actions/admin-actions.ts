"use server";

import { prisma } from "@/utils/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

async function verifyAdmin() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required");
  }
  return session.user;
}

const productSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  basePrice: z.number().positive("Base price must be greater than 0"),
  categoryId: z.string().min(1, "Please select a category"),
  image: z.string().url("Please provide a valid image URL"),
});

// Categories
export async function createCategoryAction(name: string) {
  try {
    await verifyAdmin();
    if (!name || name.trim().length < 2) {
      return { success: false, message: "Category name must be at least 2 characters" };
    }

    const count = await prisma.category.count();
    const category = await prisma.category.create({
      data: {
        name: name.trim(),
        order: count + 1,
      },
    });

    revalidatePath("/admin/categories");
    revalidatePath("/menu");

    return { success: true, message: `Category "${category.name}" created!`, category };
  } catch (error: unknown) {
    console.error("Error creating category:", error);
    return { success: false, message: (error as Error).message || "Failed to create category" };
  }
}

export async function deleteCategoryAction(id: string) {
  try {
    await verifyAdmin();

    const productCount = await prisma.product.count({
      where: { categoryId: id },
    });

    if (productCount > 0) {
      return {
        success: false,
        message: `Cannot delete: category has ${productCount} assigned products. Reassign or delete them first.`,
      };
    }

    await prisma.category.delete({
      where: { id },
    });

    revalidatePath("/admin/categories");
    revalidatePath("/menu");

    return { success: true, message: "Category deleted successfully" };
  } catch (error: unknown) {
    console.error("Error deleting category:", error);
    return { success: false, message: (error as Error).message || "Failed to delete category" };
  }
}

// Products
export async function createProductAction(data: z.infer<typeof productSchema>) {
  try {
    await verifyAdmin();
    const valid = productSchema.safeParse(data);
    if (!valid.success) {
      return { success: false, message: valid.error.issues[0].message };
    }

    const count = await prisma.product.count();
    const product = await prisma.product.create({
      data: {
        name: valid.data.name,
        description: valid.data.description,
        basePrice: valid.data.basePrice,
        image: valid.data.image,
        categoryId: valid.data.categoryId,
        order: count + 1,
      },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/products");
    revalidatePath("/menu");
    revalidatePath("/");

    return { success: true, message: `Product "${product.name}" created!`, product };
  } catch (error: unknown) {
    console.error("Error creating product:", error);
    return { success: false, message: (error as Error).message || "Failed to create product" };
  }
}

export async function updateProductAction(
  id: string,
  data: z.infer<typeof productSchema>
) {
  try {
    await verifyAdmin();
    const valid = productSchema.safeParse(data);
    if (!valid.success) {
      return { success: false, message: valid.error.issues[0].message };
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        name: valid.data.name,
        description: valid.data.description,
        basePrice: valid.data.basePrice,
        image: valid.data.image,
        categoryId: valid.data.categoryId,
      },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/products");
    revalidatePath("/menu");
    revalidatePath("/");

    return { success: true, message: `Product "${product.name}" updated!`, product };
  } catch (error: unknown) {
    console.error("Error updating product:", error);
    return { success: false, message: (error as Error).message || "Failed to update product" };
  }
}

export async function deleteProductAction(id: string) {
  try {
    await verifyAdmin();

    await prisma.size.deleteMany({ where: { productId: id } });
    await prisma.extra.deleteMany({ where: { productId: id } });
    await prisma.orderProduct.deleteMany({ where: { productId: id } });

    await prisma.product.delete({
      where: { id },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/products");
    revalidatePath("/menu");
    revalidatePath("/");

    return { success: true, message: "Product deleted successfully" };
  } catch (error: unknown) {
    console.error("Error deleting product:", error);
    return { success: false, message: (error as Error).message || "Failed to delete product" };
  }
}

// Users
export async function toggleUserRoleAction(userId: string) {
  try {
    await verifyAdmin();

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true, name: true },
    });

    if (!user) {
      return { success: false, message: "User not found" };
    }

    const newRole = user.role === "ADMIN" ? "USER" : "ADMIN";

    await prisma.user.update({
      where: { id: userId },
      data: {
        role: newRole,
        tokenVersion: { increment: 1 },
      },
    });

    revalidatePath("/admin/users");

    return {
      success: true,
      message: `${user.name} is now a ${newRole}`,
    };
  } catch (error: unknown) {
    console.error("Error toggling user role:", error);
    return { success: false, message: (error as Error).message || "Failed to change user role" };
  }
}
