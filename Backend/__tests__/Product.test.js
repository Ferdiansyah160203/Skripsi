import {
  Product,
  ProductMaterial,
  InventoryModel,
} from "../models/associations.js";
import {
  getAllProducts,
  getAvailableProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
} from "../controller/ProductController.js";

// Mock all models
jest.mock("../models/associations.js", () => ({
  Product: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
  },
  ProductMaterial: {
    findAll: jest.fn(),
    bulkCreate: jest.fn(),
    destroy: jest.fn(),
  },
  InventoryModel: {
    findByPk: jest.fn(),
  },
}));

describe("Product Controller", () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock request and response objects
    req = {
      body: {},
      params: {},
      file: null,
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  describe("getAvailableProducts", () => {
    it("should return products with availability status", async () => {
      const mockProducts = [
        {
          id: 1,
          name: "Nasi Ayam",
          price: 15000,
          category: "nasi",
          description: "Nasi dengan ayam",
          image: "/uploads/nasi-ayam.jpg",
          ProductMaterials: [
            {
              quantity_used: 2,
              inventory: {
                id: 1,
                name: "Beras",
                stock: 50,
              },
            },
            {
              quantity_used: 1,
              inventory: {
                id: 2,
                name: "Ayam",
                stock: 20,
              },
            },
          ],
        },
        {
          id: 2,
          name: "Kopi Susu",
          price: 12000,
          category: "kopi",
          description: "Kopi dengan susu",
          image: "/uploads/kopi-susu.jpg",
          ProductMaterials: [
            {
              quantity_used: 1,
              inventory: {
                id: 3,
                name: "Kopi",
                stock: 0, // Out of stock
              },
            },
          ],
        },
      ];

      Product.findAll.mockResolvedValue(mockProducts);

      await getAvailableProducts(req, res);

      expect(Product.findAll).toHaveBeenCalledWith({
        include: [
          {
            model: ProductMaterial,
            include: [
              {
                model: InventoryModel,
              },
            ],
          },
        ],
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([
        {
          id: 1,
          name: "Nasi Ayam",
          price: 15000,
          category: "nasi",
          description: "Nasi dengan ayam",
          image: "/uploads/nasi-ayam.jpg",
          available: true, // All materials have sufficient stock
        },
        {
          id: 2,
          name: "Kopi Susu",
          price: 12000,
          category: "kopi",
          description: "Kopi dengan susu",
          image: "/uploads/kopi-susu.jpg",
          available: false, // Coffee is out of stock
        },
      ]);
    });

    it("should return products as unavailable when no materials exist", async () => {
      const mockProducts = [
        {
          id: 1,
          name: "Test Product",
          price: 10000,
          category: "nasi",
          description: "Test description",
          image: "/uploads/test.jpg",
          ProductMaterials: [], // No materials
        },
      ];

      Product.findAll.mockResolvedValue(mockProducts);

      await getAvailableProducts(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([
        {
          id: 1,
          name: "Test Product",
          price: 10000,
          category: "nasi",
          description: "Test description",
          image: "/uploads/test.jpg",
          available: false, // No materials means not available
        },
      ]);
    });

    it("should return products as unavailable when materials have insufficient stock", async () => {
      const mockProducts = [
        {
          id: 1,
          name: "Test Product",
          price: 10000,
          category: "nasi",
          description: "Test description",
          image: "/uploads/test.jpg",
          ProductMaterials: [
            {
              quantity_used: 5,
              inventory: {
                id: 1,
                name: "Material 1",
                stock: 10, // Sufficient
              },
            },
            {
              quantity_used: 15,
              inventory: {
                id: 2,
                name: "Material 2",
                stock: 10, // Insufficient (needs 15, has 10)
              },
            },
          ],
        },
      ];

      Product.findAll.mockResolvedValue(mockProducts);

      await getAvailableProducts(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([
        {
          id: 1,
          name: "Test Product",
          price: 10000,
          category: "nasi",
          description: "Test description",
          image: "/uploads/test.jpg",
          available: false, // One material has insufficient stock
        },
      ]);
    });

    it("should return products as unavailable when inventory is null", async () => {
      const mockProducts = [
        {
          id: 1,
          name: "Test Product",
          price: 10000,
          category: "nasi",
          description: "Test description",
          image: "/uploads/test.jpg",
          ProductMaterials: [
            {
              quantity_used: 5,
              inventory: null, // Inventory not found
            },
          ],
        },
      ];

      Product.findAll.mockResolvedValue(mockProducts);

      await getAvailableProducts(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([
        {
          id: 1,
          name: "Test Product",
          price: 10000,
          category: "nasi",
          description: "Test description",
          image: "/uploads/test.jpg",
          available: false, // Inventory is null
        },
      ]);
    });

    it("should return products as available when all materials have exact stock needed", async () => {
      const mockProducts = [
        {
          id: 1,
          name: "Test Product",
          price: 10000,
          category: "nasi",
          description: "Test description",
          image: "/uploads/test.jpg",
          ProductMaterials: [
            {
              quantity_used: 10,
              inventory: {
                id: 1,
                name: "Material 1",
                stock: 10, // Exactly what's needed
              },
            },
            {
              quantity_used: 5,
              inventory: {
                id: 2,
                name: "Material 2",
                stock: 5, // Exactly what's needed
              },
            },
          ],
        },
      ];

      Product.findAll.mockResolvedValue(mockProducts);

      await getAvailableProducts(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([
        {
          id: 1,
          name: "Test Product",
          price: 10000,
          category: "nasi",
          description: "Test description",
          image: "/uploads/test.jpg",
          available: true, // All materials have exact stock needed
        },
      ]);
    });

    it("should return empty array when no products exist", async () => {
      Product.findAll.mockResolvedValue([]);

      await getAvailableProducts(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([]);
    });

    it("should handle products with undefined ProductMaterials", async () => {
      const mockProducts = [
        {
          id: 1,
          name: "Test Product",
          price: 10000,
          category: "nasi",
          description: "Test description",
          image: "/uploads/test.jpg",
          ProductMaterials: undefined, // Undefined materials
        },
      ];

      Product.findAll.mockResolvedValue(mockProducts);

      await getAvailableProducts(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([
        {
          id: 1,
          name: "Test Product",
          price: 10000,
          category: "nasi",
          description: "Test description",
          image: "/uploads/test.jpg",
          available: false, // Undefined materials treated as empty array
        },
      ]);
    });

    it("should handle multiple products with mixed availability", async () => {
      const mockProducts = [
        {
          id: 1,
          name: "Available Product",
          price: 10000,
          category: "nasi",
          description: "Available product",
          image: "/uploads/available.jpg",
          ProductMaterials: [
            {
              quantity_used: 5,
              inventory: {
                id: 1,
                name: "Material 1",
                stock: 20,
              },
            },
          ],
        },
        {
          id: 2,
          name: "Unavailable Product",
          price: 15000,
          category: "kopi",
          description: "Unavailable product",
          image: "/uploads/unavailable.jpg",
          ProductMaterials: [
            {
              quantity_used: 10,
              inventory: {
                id: 2,
                name: "Material 2",
                stock: 5, // Insufficient
              },
            },
          ],
        },
        {
          id: 3,
          name: "No Materials Product",
          price: 8000,
          category: "camilan",
          description: "No materials product",
          image: "/uploads/no-materials.jpg",
          ProductMaterials: [],
        },
      ];

      Product.findAll.mockResolvedValue(mockProducts);

      await getAvailableProducts(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([
        {
          id: 1,
          name: "Available Product",
          price: 10000,
          category: "nasi",
          description: "Available product",
          image: "/uploads/available.jpg",
          available: true,
        },
        {
          id: 2,
          name: "Unavailable Product",
          price: 15000,
          category: "kopi",
          description: "Unavailable product",
          image: "/uploads/unavailable.jpg",
          available: false,
        },
        {
          id: 3,
          name: "No Materials Product",
          price: 8000,
          category: "camilan",
          description: "No materials product",
          image: "/uploads/no-materials.jpg",
          available: false,
        },
      ]);
    });

    it("should handle database errors", async () => {
      Product.findAll.mockRejectedValue(
        new Error("Database connection failed")
      );

      await getAvailableProducts(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Error fetching available products",
        error: "Database connection failed",
      });
    });

    it("should handle products with zero quantity needed", async () => {
      const mockProducts = [
        {
          id: 1,
          name: "Test Product",
          price: 10000,
          category: "nasi",
          description: "Test description",
          image: "/uploads/test.jpg",
          ProductMaterials: [
            {
              quantity_used: 0, // Zero quantity needed
              inventory: {
                id: 1,
                name: "Material 1",
                stock: 10,
              },
            },
          ],
        },
      ];

      Product.findAll.mockResolvedValue(mockProducts);

      await getAvailableProducts(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([
        {
          id: 1,
          name: "Test Product",
          price: 10000,
          category: "nasi",
          description: "Test description",
          image: "/uploads/test.jpg",
          available: true, // Zero quantity needed means always available
        },
      ]);
    });

    it("should handle products with very large stock numbers", async () => {
      const mockProducts = [
        {
          id: 1,
          name: "Test Product",
          price: 10000,
          category: "nasi",
          description: "Test description",
          image: "/uploads/test.jpg",
          ProductMaterials: [
            {
              quantity_used: 1000,
              inventory: {
                id: 1,
                name: "Material 1",
                stock: 999999, // Very large stock
              },
            },
          ],
        },
      ];

      Product.findAll.mockResolvedValue(mockProducts);

      await getAvailableProducts(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([
        {
          id: 1,
          name: "Test Product",
          price: 10000,
          category: "nasi",
          description: "Test description",
          image: "/uploads/test.jpg",
          available: true, // Large stock is sufficient
        },
      ]);
    });
  });

  describe("getAllProducts", () => {
    it("should get all products successfully", async () => {
      const mockProducts = [
        {
          id: 1,
          name: "Test Product",
          price: 10000,
          category: "nasi",
          description: "Test description",
          image: "/uploads/test.jpg",
        },
      ];

      Product.findAll.mockResolvedValue(mockProducts);

      await getAllProducts(req, res);

      expect(Product.findAll).toHaveBeenCalledWith({
        include: {
          model: ProductMaterial,
          include: InventoryModel,
        },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockProducts);
    });

    it("should handle database errors", async () => {
      Product.findAll.mockRejectedValue(new Error("Database error"));

      await getAllProducts(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Error fetching products",
        error: expect.any(Error),
      });
    });
  });

  describe("getProductById", () => {
    it("should get product by id successfully", async () => {
      const mockProduct = {
        id: 1,
        name: "Test Product",
        price: 10000,
        category: "nasi",
        description: "Test description",
        image: "/uploads/test.jpg",
      };

      req.params.id = "1";
      Product.findByPk.mockResolvedValue(mockProduct);

      await getProductById(req, res);

      expect(Product.findByPk).toHaveBeenCalledWith("1", {
        include: {
          model: ProductMaterial,
          include: InventoryModel,
        },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockProduct);
    });

    it("should return 404 if product not found", async () => {
      req.params.id = "999";
      Product.findByPk.mockResolvedValue(null);

      await getProductById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Product not found",
      });
    });

    it("should handle database errors", async () => {
      req.params.id = "1";
      Product.findByPk.mockRejectedValue(new Error("Database error"));

      await getProductById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Error fetching product",
        error: expect.any(Error),
      });
    });
  });
});
