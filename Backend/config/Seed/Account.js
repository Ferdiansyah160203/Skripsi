import bcrypt from "bcrypt";
import db from "../Database.js";
import User from "../../models/UserModel.js";
import Product from "../../models/ProductModel.js";
import Member from "../../models/MemberModel.js";
import InventoryModel from "../../models/InventoriesModel.js";

const seedDatabase = async () => {
  try {
    // Sync database
    // await db.sync({ force: true });
    console.log("Database synced successfully");

    // Seed Users
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const hashedCashierPassword = await bcrypt.hash("cashier123", 10);

    const users = await User.bulkCreate([
      {
        name: "Administrator",
        email: "admin@pos.com",
        password: hashedPassword,
        role: "admin",
        status: "active",
      },
      {
        name: "Cashier 1",
        email: "cashier1@pos.com",
        password: hashedCashierPassword,
        role: "cashier",
        status: "active",
      },
      {
        name: "Cashier 2",
        email: "cashier2@pos.com",
        password: hashedCashierPassword,
        role: "cashier",
        status: "active",
      },
    ]);

    console.log("Users seeded successfully");

    // Seed Products
    const products = await Product.bulkCreate([
      // Nasi
      {
        name: "Nasi Ayam Geprek",
        price: 15000,
        category: "Nasi",
        description: "Nasi dengan ayam geprek pedas dan sambal",
      },
      {
        name: "Nasi Ayam Bakar",
        price: 18000,
        category: "Nasi",
        description: "Nasi dengan ayam bakar khas rumahan",
      },
      {
        name: "Nasi Ayam Katsu",
        price: 20000,
        category: "Nasi",
        description: "Nasi dengan ayam katsu crispy",
      },
      {
        name: "Nasi Rendang",
        price: 22000,
        category: "Nasi",
        description: "Nasi dengan rendang daging sapi",
      },

      // Camilan
      {
        name: "Pisang Goreng",
        price: 8000,
        category: "Camilan",
        description: "Pisang goreng crispy dengan topping",
      },
      {
        name: "Tahu Crispy",
        price: 10000,
        category: "Camilan",
        description: "Tahu goreng crispy dengan saus",
      },
      {
        name: "Kentang Goreng",
        price: 12000,
        category: "Camilan",
        description: "Kentang goreng dengan berbagai saus",
      },
      {
        name: "Tempe Mendoan",
        price: 7000,
        category: "Camilan",
        description: "Tempe mendoan khas Jawa",
      },

      // Roti
      {
        name: "Roti Bakar Coklat",
        price: 15000,
        category: "Roti",
        description: "Roti bakar dengan selai coklat dan keju",
      },
      {
        name: "Roti Bakar Strawberry",
        price: 16000,
        category: "Roti",
        description: "Roti bakar dengan selai strawberry dan keju",
      },
      {
        name: "Roti Bakar Pisang",
        price: 14000,
        category: "Roti",
        description: "Roti bakar dengan pisang dan madu",
      },

      // Kopi
      {
        name: "Kopi Hitam",
        price: 8000,
        category: "Kopi",
        description: "Kopi hitam murni tanpa gula",
      },
      {
        name: "Kopi Susu",
        price: 12000,
        category: "Kopi",
        description: "Kopi dengan susu segar",
      },
      {
        name: "Cappuccino",
        price: 18000,
        category: "Kopi",
        description: "Cappuccino dengan foam susu",
      },
      {
        name: "Latte",
        price: 20000,
        category: "Kopi",
        description: "Latte dengan art susu",
      },
      {
        name: "Americano",
        price: 15000,
        category: "Kopi",
        description: "Americano dengan espresso shot",
      },

      // Non Kopi
      {
        name: "Teh Manis",
        price: 5000,
        category: "Non Kopi",
        description: "Teh manis hangat",
      },
      {
        name: "Teh Tarik",
        price: 8000,
        category: "Non Kopi",
        description: "Teh tarik dengan susu",
      },
      {
        name: "Jus Jeruk",
        price: 12000,
        category: "Non Kopi",
        description: "Jus jeruk segar",
      },
      {
        name: "Jus Alpukat",
        price: 15000,
        category: "Non Kopi",
        description: "Jus alpukat dengan susu",
      },
      {
        name: "Es Teh Manis",
        price: 6000,
        category: "Non Kopi",
        description: "Es teh manis dingin",
      },
      {
        name: "Chocolate Milkshake",
        price: 18000,
        category: "Non Kopi",
        description: "Milkshake coklat dengan whipped cream",
      },
    ]);

    console.log("Products seeded successfully");

    // Seed Members
    const members = await Member.bulkCreate([
      {
        name: "John Doe",
        phone: "081234567890",
        email: "john.doe@email.com",
        total_spent: 125000,
        total_points: 125,
      },
      {
        name: "Jane Smith",
        phone: "081234567891",
        email: "jane.smith@email.com",
        total_spent: 89000,
        total_points: 89,
      },
      {
        name: "Bob Wilson",
        phone: "081234567892",
        email: "bob.wilson@email.com",
        total_spent: 67000,
        total_points: 67,
      },
      {
        name: "Alice Brown",
        phone: "081234567893",
        email: "alice.brown@email.com",
        total_spent: 156000,
        total_points: 156,
      },
      {
        name: "Charlie Davis",
        phone: "081234567894",
        email: "charlie.davis@email.com",
        total_spent: 234000,
        total_points: 234,
      },
      {
        name: "Diana Miller",
        phone: "081234567895",
        email: "diana.miller@email.com",
        total_spent: 78000,
        total_points: 78,
      },
      {
        name: "Edward Garcia",
        phone: "081234567896",
        email: "edward.garcia@email.com",
        total_spent: 145000,
        total_points: 145,
      },
      {
        name: "Fiona Martinez",
        phone: "081234567897",
        email: "fiona.martinez@email.com",
        total_spent: 92000,
        total_points: 92,
      },
    ]);

    console.log("Members seeded successfully");

    // Seed Inventories
    const inventories = await InventoryModel.bulkCreate([
      {
        name: "Beras Premium",
        unit: "kg",
        stock: 50,
      },
      {
        name: "Ayam Fillet",
        unit: "kg",
        stock: 25,
      },
      {
        name: "Daging Sapi",
        unit: "kg",
        stock: 15,
      },
      {
        name: "Telur Ayam",
        unit: "butir",
        stock: 100,
      },
      {
        name: "Kentang",
        unit: "kg",
        stock: 20,
      },
      {
        name: "Pisang",
        unit: "sisir",
        stock: 15,
      },
      {
        name: "Tahu",
        unit: "buah",
        stock: 50,
      },
      {
        name: "Tempe",
        unit: "papan",
        stock: 30,
      },
      {
        name: "Roti Tawar",
        unit: "bungkus",
        stock: 20,
      },

      // Bahan Minuman
      {
        name: "Kopi Arabica",
        unit: "kg",
        stock: 10,
      },
      {
        name: "Kopi Robusta",
        unit: "kg",
        stock: 8,
      },
      {
        name: "Teh Celup",
        unit: "box",
        stock: 15,
      },
      {
        name: "Susu Segar",
        unit: "liter",
        stock: 25,
      },
      {
        name: "Gula Pasir",
        unit: "kg",
        stock: 30,
      },
      {
        name: "Jeruk",
        unit: "kg",
        stock: 20,
      },
      {
        name: "Alpukat",
        unit: "buah",
        stock: 25,
      },
      {
        name: "Coklat Bubuk",
        unit: "kg",
        stock: 5,
      },

      // Bahan Tambahan
      {
        name: "Minyak Goreng",
        unit: "liter",
        stock: 20,
      },
      {
        name: "Tepung Terigu",
        unit: "kg",
        stock: 15,
      },
      {
        name: "Keju",
        unit: "kg",
        stock: 3,
      },
      {
        name: "Selai Coklat",
        unit: "jar",
        stock: 10,
      },
      {
        name: "Selai Strawberry",
        unit: "jar",
        stock: 8,
      },
      {
        name: "Madu",
        unit: "botol",
        stock: 12,
      },
      {
        name: "Whipped Cream",
        unit: "botol",
        stock: 15,
      },
      {
        name: "Es Batu",
        unit: "kg",
        stock: 50,
      },
      {
        name: "Garam",
        unit: "kg",
        stock: 5,
      },
      {
        name: "Merica",
        unit: "kg",
        stock: 2,
      },
    ]);

    console.log("Inventories seeded successfully");

    console.log("=== SEEDING COMPLETED ===");
    console.log("Default Admin Account:");
    console.log("Email: admin@pos.com");
    console.log("Password: admin123");
    console.log("");
    console.log("Default Cashier Accounts:");
    console.log("Email: cashier1@pos.com | Password: cashier123");
    console.log("Email: cashier2@pos.com | Password: cashier123");
    console.log("");
    console.log(`Total records created:`);
    console.log(`- Users: ${users.length}`);
    console.log(`- Products: ${products.length}`);
    console.log(`- Members: ${members.length}`);
    console.log(`- Inventories: ${inventories.length}`);
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await db.close();
    process.exit(0);
  }
};

seedDatabase();

export default seedDatabase;
