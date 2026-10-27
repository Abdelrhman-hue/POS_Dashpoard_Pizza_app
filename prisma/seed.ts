import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";
import { UserRole } from "@/lib/generated/prisma/client";


const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

export const categories = [
  { name: "Pizza" },
  { name: "Burger" },
  { name: "Pasta" },
  { name: "Drinks" },
  { name: "Desserts" },
  { name: "Salads" },
  { name: "Appetizers" },
];


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _products = [
  {
    name: "Margherita Pizza",
    description:
      "Classic pizza with fresh mozzarella cheese, tomato sauce, and basil.",
    image: "/images/products/margherita.png",
    basePrice: 9.99,
    category: "Pizza",
  },
  {
    name: "Pepperoni Pizza",
    description:
      "Loaded with mozzarella cheese and premium pepperoni slices.",
    image: "/images/products/pepperoni.png",
    basePrice: 12.99,
    category: "Pizza",
  },
  {
    name: "BBQ Chicken Pizza",
    description:
      "Grilled chicken with smoky BBQ sauce, onions, and mozzarella.",
    image: "/images/products/bbq-chicken.png",
    basePrice: 13.99,
    category: "Pizza",
  },
  {
    name: "Hawaiian Pizza",
    description:
      "Ham, pineapple chunks, mozzarella cheese, and tomato sauce.",
    image: "/images/products/hawaiian.png",
    basePrice: 11.99,
    category: "Pizza",
  },
  {
    name: "Meat Lovers Pizza",
    description:
      "Pepperoni, sausage, beef, smoked turkey, and mozzarella cheese.",
    image: "/images/products/meat-lovers.png",
    basePrice: 15.99,
    category: "Pizza",
  },
  {
    name: "Veggie Pizza",
    description:
      "Fresh mushrooms, onions, olives, peppers, and tomatoes.",
    image: "/images/products/veggie.png",
    basePrice: 10.99,
    category: "Pizza",
  },
  {
    name: "Four Cheese Pizza",
    description:
      "Mozzarella, cheddar, parmesan, and blue cheese blend.",
    image: "/images/products/four-cheese.png",
    basePrice: 13.49,
    category: "Pizza",
  },
  {
    name: "Buffalo Chicken Pizza",
    description:
      "Spicy buffalo chicken with ranch dressing and mozzarella.",
    image: "/images/products/buffalo-chicken.png",
    basePrice: 14.49,
    category: "Pizza",
  },
  {
    name: "Seafood Pizza",
    description:
      "Shrimp, calamari, mozzarella cheese, and garlic sauce.",
    image: "/images/products/seafood.png",
    basePrice: 16.99,
    category: "Pizza",
  },
  {
    name: "Supreme Pizza",
    description:
      "Pepperoni, beef, mushrooms, olives, onions, and peppers.",
    image: "/images/products/supreme.png",
    basePrice: 15.49,
    category: "Pizza",
  },
  {
    name: "Cheese Burger",
    description:
      "Juicy grilled beef burger with cheddar cheese and lettuce.",
    image: "/images/products/cheese-burger.png",
    basePrice: 8.99,
    category: "Burger",
  },
  {
    name: "Classic Burger",
    description:
      "Grilled beef burger with tomato, lettuce, and pickles.",
    image: "/images/products/classic-burger.png",
    basePrice: 7.99,
    category: "Burger",
  },
  {
    name: "BBQ Burger",
    description:
      "Beef burger topped with BBQ sauce, onion rings, and cheese.",
    image: "/images/products/bbq-burger.png",
    basePrice: 9.99,
    category: "Burger",
  },
  {
    name: "Chicken Alfredo Pasta",
    description:
      "Creamy Alfredo pasta served with grilled chicken breast.",
    image: "/images/products/chicken-alfredo.png",
    basePrice: 12.49,
    category: "Pasta",
  },
  {
    name: "Spaghetti Bolognese",
    description:
      "Italian pasta with rich beef Bolognese sauce.",
    image: "/images/products/bolognese.png",
    basePrice: 11.49,
    category: "Pasta",
  },
  {
    name: "Caesar Salad",
    description:
      "Fresh romaine lettuce with parmesan cheese and Caesar dressing.",
    image: "/images/products/caesar-salad.png",
    basePrice: 6.99,
    category: "Salads",
  },
  {
    name: "Greek Salad",
    description:
      "Tomatoes, cucumbers, olives, feta cheese, and olive oil.",
    image: "/images/products/greek-salad.png",
    basePrice: 6.49,
    category: "Salads",
  },
  {
    name: "French Fries",
    description:
      "Golden crispy fries seasoned with sea salt.",
    image: "/images/products/fries.png",
    basePrice: 3.99,
    category: "Appetizers",
  },
  {
    name: "Chicken Wings",
    description:
      "Crispy chicken wings served with spicy buffalo sauce.",
    image: "/images/products/chicken-wings.png",
    basePrice: 8.49,
    category: "Appetizers",
  },
  {
    name: "Chocolate Brownie",
    description:
      "Rich chocolate brownie served warm.",
    image: "/images/products/brownie.png",
    basePrice: 4.99,
    category: "Desserts",
  },
];


const users = [
  {
    name: "Admin",
    email: "admin@pizza.com",
    password: "123456",
    image: "/images/users/admin.png",
    phone: "+201001112233",
    streetAddress: "15 El Nasr Street",
    postalCode: "11511",
    city: "Cairo",
    country: "Egypt",
    role: UserRole.ADMIN,
  },
  {
    name: "Ahmed Mohamed",
    email: "ahmed@gmail.com",
    password: "123456",
    image: "/images/users/user-1.png",
    phone: "+201012345678",
    streetAddress: "12 Salah Salem",
    postalCode: "11511",
    city: "Cairo",
    country: "Egypt",
    role: UserRole.USER,
  },
  {
    name: "Sara Ali",
    email: "sara@gmail.com",
    password: "123456",
    image: "/images/users/user-2.png",
    phone: "+201055566677",
    streetAddress: "8 Tanta Street",
    postalCode: "31511",
    city: "Tanta",
    country: "Egypt",
    role: UserRole.USER,
  },
  {
    name: "Omar Hassan",
    email: "omar@gmail.com",
    password: "123456",
    image: "/images/users/user-3.png",
    phone: "+201011223344",
    streetAddress: "22 Al Gomhoria",
    postalCode: "21111",
    city: "Alexandria",
    country: "Egypt",
    role: UserRole.USER,
  },
  {
    name: "Mariam Mostafa",
    email: "mariam@gmail.com",
    password: "123456",
    image: "/images/users/user-4.png",
    phone: "+201099887766",
    streetAddress: "17 Nile Street",
    postalCode: "35511",
    city: "Mansoura",
    country: "Egypt",
    role: UserRole.USER,
  },
  {
    name: "Youssef Ibrahim",
    email: "youssef@gmail.com",
    password: "123456",
    image: "/images/users/user-5.png",
    phone: "+201077788899",
    streetAddress: "5 El Geish Road",
    postalCode: "31111",
    city: "Zagazig",
    country: "Egypt",
    role: UserRole.USER,
  },
  {
    name: "Nour Ahmed",
    email: "nour@gmail.com",
    password: "123456",
    image: "/images/users/user-6.png",
    phone: "+201010203040",
    streetAddress: "30 Mostafa Kamel",
    postalCode: "21511",
    city: "Alexandria",
    country: "Egypt",
    role: UserRole.USER,
  },
  {
    name: "Mahmoud Adel",
    email: "mahmoud@gmail.com",
    password: "123456",
    image: "/images/users/user-7.png",
    phone: "+201033344455",
    streetAddress: "44 Al Haram",
    postalCode: "12511",
    city: "Giza",
    country: "Egypt",
    role: UserRole.USER,
  },
  {
    name: "Salma Tarek",
    email: "salma@gmail.com",
    password: "123456",
    image: "/images/users/user-8.png",
    phone: "+201066677788",
    streetAddress: "19 Al Ahram",
    postalCode: "12512",
    city: "Giza",
    country: "Egypt",
    role: UserRole.USER,
  },
  {
    name: "Karim Samy",
    email: "karim@gmail.com",
    password: "123456",
    image: "/images/users/user-9.png",
    phone: "+201022233344",
    streetAddress: "7 Corniche",
    postalCode: "21112",
    city: "Alexandria",
    country: "Egypt",
    role: UserRole.USER,
  }
];

async function main() {
  console.log("🌱 Seeding...");




  // Products
  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);

  await prisma.user.create({
    data: {
      ...user,
      password: hashedPassword,
    },
  });
}

  console.log("✅ Database Seeded");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });

