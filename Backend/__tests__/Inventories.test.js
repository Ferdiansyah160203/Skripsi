import InventoryModel from "../models/InventoriesModel.js";
import {
  createInventory,
  getAllInventories,
  getInventoryById,
  updateInventory,
  deleteInventory,
} from "../controller/InventoriesController.js";

// Mock InventoryModel
jest.mock("../models/InventoriesModel.js", () => ({
  create: jest.fn(),
  findAll: jest.fn(),
  findByPk: jest.fn(),
}));

describe("Inventories Controller", () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock request and response objects
    req = {
      body: {},
      params: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  describe("createInventory", () => {
    it("should create a new inventory successfully", async () => {
      const inventoryData = {
        name: "Rice",
        unit: "kg",
        stock: 100,
      };

      req.body = inventoryData;

      const mockCreatedInventory = {
        id: 1,
        ...inventoryData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      InventoryModel.create.mockResolvedValue(mockCreatedInventory);

      await createInventory(req, res);

      expect(InventoryModel.create).toHaveBeenCalledWith(inventoryData);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Inventory created successfully",
        newInventory: mockCreatedInventory,
      });
    });

    it("should fail if required fields are missing", async () => {
      req.body = {
        name: "Rice",
        // missing unit and stock
      };

      await createInventory(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "All fields are required",
      });
      expect(InventoryModel.create).not.toHaveBeenCalled();
    });

    it("should fail if name is missing", async () => {
      req.body = {
        unit: "kg",
        stock: 100,
      };

      await createInventory(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "All fields are required",
      });
    });

    it("should fail if unit is missing", async () => {
      req.body = {
        name: "Rice",
        stock: 100,
      };

      await createInventory(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "All fields are required",
      });
    });

    it("should fail if stock is missing", async () => {
      req.body = {
        name: "Rice",
        unit: "kg",
      };

      await createInventory(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "All fields are required",
      });
    });

    it("should handle database errors", async () => {
      req.body = {
        name: "Rice",
        unit: "kg",
        stock: 100,
      };

      InventoryModel.create.mockRejectedValue(new Error("Database error"));

      await createInventory(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Error creating inventory",
        error: expect.any(Error),
      });
    });
  });

  describe("getAllInventories", () => {
    it("should get all inventories successfully", async () => {
      const mockInventories = [
        {
          id: 1,
          name: "Rice",
          unit: "kg",
          stock: 100,
        },
        {
          id: 2,
          name: "Flour",
          unit: "kg",
          stock: 50,
        },
      ];

      InventoryModel.findAll.mockResolvedValue(mockInventories);

      await getAllInventories(req, res);

      expect(InventoryModel.findAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockInventories);
    });

    it("should handle database errors", async () => {
      InventoryModel.findAll.mockRejectedValue(new Error("Database error"));

      await getAllInventories(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Error fetching inventories",
        error: expect.any(Error),
      });
    });
  });

  describe("getInventoryById", () => {
    it("should get inventory by id successfully", async () => {
      const mockInventory = {
        id: 1,
        name: "Rice",
        unit: "kg",
        stock: 100,
      };

      req.params.id = "1";
      InventoryModel.findByPk.mockResolvedValue(mockInventory);

      await getInventoryById(req, res);

      expect(InventoryModel.findByPk).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockInventory);
    });

    it("should return 404 if inventory not found", async () => {
      req.params.id = "999";
      InventoryModel.findByPk.mockResolvedValue(null);

      await getInventoryById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Inventory not found",
      });
    });

    it("should handle database errors", async () => {
      req.params.id = "1";
      InventoryModel.findByPk.mockRejectedValue(new Error("Database error"));

      await getInventoryById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Error fetching inventory",
        error: expect.any(Error),
      });
    });
  });

  describe("updateInventory", () => {
    it("should update inventory successfully", async () => {
      const mockInventory = {
        id: 1,
        name: "Rice",
        unit: "kg",
        stock: 100,
        save: jest.fn(),
      };

      req.params.id = "1";
      req.body = {
        name: "Updated Rice",
        unit: "bags",
        stock: 75,
      };

      InventoryModel.findByPk.mockResolvedValue(mockInventory);

      await updateInventory(req, res);

      expect(mockInventory.name).toBe("Updated Rice");
      expect(mockInventory.unit).toBe("bags");
      expect(mockInventory.stock).toBe(75);
      expect(mockInventory.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Inventory updated successfully",
        inventory: mockInventory,
      });
    });

    it("should update inventory with partial data", async () => {
      const mockInventory = {
        id: 1,
        name: "Rice",
        unit: "kg",
        stock: 100,
        save: jest.fn(),
      };

      req.params.id = "1";
      req.body = {
        stock: 25,
      };

      InventoryModel.findByPk.mockResolvedValue(mockInventory);

      await updateInventory(req, res);

      expect(mockInventory.stock).toBe(25);
      expect(mockInventory.name).toBe("Rice"); // unchanged
      expect(mockInventory.unit).toBe("kg"); // unchanged
      expect(mockInventory.save).toHaveBeenCalled();
    });

    it("should return 404 if inventory not found", async () => {
      req.params.id = "999";
      req.body = { name: "Updated Name" };

      InventoryModel.findByPk.mockResolvedValue(null);

      await updateInventory(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Inventory not found",
      });
    });

    it("should handle database errors", async () => {
      req.params.id = "1";
      req.body = { name: "Updated Name" };

      InventoryModel.findByPk.mockRejectedValue(new Error("Database error"));

      await updateInventory(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Error updating inventory",
        error: expect.any(Error),
      });
    });
  });

  describe("deleteInventory", () => {
    it("should delete inventory successfully", async () => {
      const mockInventory = {
        id: 1,
        name: "Rice",
        unit: "kg",
        stock: 100,
        destroy: jest.fn(),
      };

      req.params.id = "1";
      InventoryModel.findByPk.mockResolvedValue(mockInventory);

      await deleteInventory(req, res);

      expect(mockInventory.destroy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Inventory deleted successfully",
      });
    });

    it("should return 404 if inventory not found", async () => {
      req.params.id = "999";
      InventoryModel.findByPk.mockResolvedValue(null);

      await deleteInventory(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Inventory not found",
      });
    });

    it("should handle database errors", async () => {
      req.params.id = "1";
      InventoryModel.findByPk.mockRejectedValue(new Error("Database error"));

      await deleteInventory(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Error deleting inventory",
        error: expect.any(Error),
      });
    });
  });

  describe("Edge Cases", () => {
    it("should handle zero stock value", async () => {
      req.body = {
        name: "Empty Item",
        unit: "pieces",
        stock: 0,
      };

      const mockCreatedInventory = {
        id: 1,
        ...req.body,
      };

      InventoryModel.create.mockResolvedValue(mockCreatedInventory);

      await createInventory(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Inventory created successfully",
        newInventory: mockCreatedInventory,
      });
    });

    it("should handle negative stock value", async () => {
      req.body = {
        name: "Negative Item",
        unit: "pieces",
        stock: -10,
      };

      const mockCreatedInventory = {
        id: 1,
        ...req.body,
      };

      InventoryModel.create.mockResolvedValue(mockCreatedInventory);

      await createInventory(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Inventory created successfully",
        newInventory: mockCreatedInventory,
      });
    });

    it("should handle large stock values", async () => {
      req.body = {
        name: "Large Stock Item",
        unit: "tons",
        stock: 999999.99,
      };

      const mockCreatedInventory = {
        id: 1,
        ...req.body,
      };

      InventoryModel.create.mockResolvedValue(mockCreatedInventory);

      await createInventory(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Inventory created successfully",
        newInventory: mockCreatedInventory,
      });
    });

    it("should handle empty string values", async () => {
      req.body = {
        name: "",
        unit: "",
        stock: 10,
      };

      await createInventory(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "All fields are required",
      });
    });
  });
});
