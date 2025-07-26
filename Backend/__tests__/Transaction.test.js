import Transaction from "../models/TransactionModel.js";
import Product from "../models/ProductModel.js";
import TransactionProduct from "../models/TransactionProductModel.js";
import Member from "../models/MemberModel.js";
import PointPromo from "../models/PointPromoModel.js";
import { ProductMaterial, InventoryModel } from "../models/associations.js";
import {
  createTransaction,
  updateTransaction,
  getTransactionById,
  getAllTransactions,
  markAsPaid,
  cancelTransaction,
} from "../controller/TransactionController.js";

// Mock all models
jest.mock("../models/TransactionModel.js", () => ({
  create: jest.fn(),
  findAll: jest.fn(),
  findByPk: jest.fn(),
  destroy: jest.fn(),
}));

jest.mock("../models/ProductModel.js", () => ({
  findByPk: jest.fn(),
}));

jest.mock("../models/TransactionProductModel.js", () => ({
  create: jest.fn(),
  findAll: jest.fn(),
  destroy: jest.fn(),
  update: jest.fn(),
}));

jest.mock("../models/MemberModel.js", () => ({
  findOne: jest.fn(),
  findByPk: jest.fn(),
}));

jest.mock("../models/PointPromoModel.js", () => ({
  findAll: jest.fn(),
}));

jest.mock("../models/associations.js", () => ({
  ProductMaterial: {
    findAll: jest.fn(),
  },
  InventoryModel: {
    findByPk: jest.fn(),
  },
}));

// Mock Sequelize Op
jest.mock("sequelize", () => ({
  Op: {
    or: Symbol("or"),
  },
}));

describe("Transaction Controller", () => {
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

  describe("createTransaction", () => {
    beforeEach(() => {
      // Setup default mocks for create transaction
      Product.findByPk.mockResolvedValue({
        id: 1,
        name: "Test Product",
        price: 10000,
      });

      ProductMaterial.findAll.mockResolvedValue([
        {
          inventories_id: 1,
          quantity_used: 1,
        },
      ]);

      InventoryModel.findByPk.mockResolvedValue({
        id: 1,
        name: "Test Inventory",
        stock: 100,
        save: jest.fn(),
      });

      Transaction.create.mockResolvedValue({
        id: 1,
        total_price: 10000,
        final_price: 10000,
        payment_method: "cash",
        status: "unpaid",
      });

      TransactionProduct.create.mockResolvedValue({
        id: 1,
        transaction_id: 1,
        product_id: 1,
        quantity_sold: 1,
        price: 10000,
      });
    });

    it("should create a transaction successfully", async () => {
      req.body = {
        payment_method: "cash",
        discount: 0,
        products: [
          {
            product_id: 1,
            quantity_sold: 1,
          },
        ],
        cash_paid: 10000,
      };

      await createTransaction(req, res);

      expect(Product.findByPk).toHaveBeenCalledWith(1);
      expect(Transaction.create).toHaveBeenCalled();
      expect(TransactionProduct.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Transaction created successfully",
        transaction: expect.any(Object),
      });
    });

    it("should fail if no products provided", async () => {
      req.body = {
        payment_method: "cash",
        products: [],
      };

      await createTransaction(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "At least one product is required",
      });
    });

    it("should fail if product not found", async () => {
      req.body = {
        payment_method: "cash",
        products: [
          {
            product_id: 999,
            quantity_sold: 1,
          },
        ],
      };

      Product.findByPk.mockResolvedValue(null);

      await createTransaction(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Product with ID 999 not found",
      });
    });

    it("should allow negative stock (stock can go minus)", async () => {
      req.body = {
        payment_method: "cash",
        products: [
          {
            product_id: 1,
            quantity_sold: 10,
          },
        ],
      };

      InventoryModel.findByPk.mockResolvedValue({
        id: 1,
        name: "Test Inventory",
        stock: 5, // Stock akan menjadi minus setelah transaksi
        save: jest.fn(),
      });

      await createTransaction(req, res);

      // Transaksi harus berhasil meskipun stock tidak cukup
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Transaction created successfully",
        transaction: expect.any(Object),
      });
    });

    it("should handle member transactions", async () => {
      req.body = {
        payment_method: "cash",
        member_identifier: "08123456789",
        products: [
          {
            product_id: 1,
            quantity_sold: 1,
          },
        ],
        cash_paid: 10000,
      };

      Member.findOne.mockResolvedValue({
        id: 1,
        name: "Test Member",
        phone: "08123456789",
      });

      await createTransaction(req, res);

      expect(Member.findOne).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it("should handle database errors", async () => {
      req.body = {
        payment_method: "cash",
        products: [
          {
            product_id: 1,
            quantity_sold: 1,
          },
        ],
      };

      Product.findByPk.mockRejectedValue(new Error("Database error"));

      await createTransaction(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Error creating transaction",
        error: "Database error",
      });
    });
  });

  describe("updateTransaction", () => {
    beforeEach(() => {
      Transaction.findByPk.mockResolvedValue({
        id: 1,
        total_price: 10000,
        final_price: 10000,
        payment_method: "cash",
        status: "unpaid",
        save: jest.fn(),
      });

      Product.findByPk.mockResolvedValue({
        id: 1,
        name: "Test Product",
        price: 10000,
      });

      TransactionProduct.destroy.mockResolvedValue();
      TransactionProduct.create.mockResolvedValue({});
    });

    it("should update transaction successfully", async () => {
      req.params.id = "1";
      req.body = {
        payment_method: "e-wallet",
        discount: 10,
        products: [
          {
            product_id: 1,
            quantity_sold: 2,
          },
        ],
      };

      await updateTransaction(req, res);

      expect(Transaction.findByPk).toHaveBeenCalledWith("1");
      expect(TransactionProduct.destroy).toHaveBeenCalledWith({
        where: { transaction_id: "1" },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Transaction updated successfully",
        transaction: expect.any(Object),
      });
    });

    it("should return 404 if transaction not found", async () => {
      req.params.id = "999";
      Transaction.findByPk.mockResolvedValue(null);

      await updateTransaction(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Transaction not found",
      });
    });

    it("should handle database errors", async () => {
      req.params.id = "1";
      req.body = {
        payment_method: "cash",
        products: [],
      };

      Transaction.findByPk.mockRejectedValue(new Error("Database error"));

      await updateTransaction(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Error updating transaction",
        error: "Database error",
      });
    });
  });

  describe("getTransactionById", () => {
    it("should get transaction by id successfully", async () => {
      const mockTransaction = {
        id: 1,
        total_price: 10000,
        final_price: 10000,
        payment_method: "cash",
        status: "unpaid",
        toJSON: jest.fn().mockReturnValue({
          id: 1,
          total_price: 10000,
          final_price: 10000,
          payment_method: "cash",
          status: "unpaid",
        }),
      };

      req.params.id = "1";
      Transaction.findByPk.mockResolvedValue(mockTransaction);
      TransactionProduct.findAll.mockResolvedValue([
        {
          product_id: 1,
          quantity_sold: 1,
          price: 10000,
          Product: {
            name: "Test Product",
          },
        },
      ]);

      await getTransactionById(req, res);

      expect(Transaction.findByPk).toHaveBeenCalledWith("1");
      expect(TransactionProduct.findAll).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        id: 1,
        total_price: 10000,
        final_price: 10000,
        payment_method: "cash",
        status: "unpaid",
        items: [
          {
            product_id: 1,
            name: "Test Product",
            qty: 1,
            price: 10000,
            subtotal: 10000,
          },
        ],
      });
    });

    it("should return 404 if transaction not found", async () => {
      req.params.id = "999";
      Transaction.findByPk.mockResolvedValue(null);

      await getTransactionById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Transaksi tidak ditemukan",
      });
    });

    it("should handle database errors", async () => {
      req.params.id = "1";
      Transaction.findByPk.mockRejectedValue(new Error("Database error"));

      await getTransactionById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Gagal mengambil transaksi",
      });
    });
  });

  describe("getAllTransactions", () => {
    it("should get all transactions successfully", async () => {
      const mockTransactions = [
        {
          id: 1,
          total_price: 10000,
          final_price: 10000,
          payment_method: "cash",
          status: "unpaid",
        },
        {
          id: 2,
          total_price: 15000,
          final_price: 15000,
          payment_method: "e-wallet",
          status: "paid",
        },
      ];

      Transaction.findAll.mockResolvedValue(mockTransactions);

      await getAllTransactions(req, res);

      expect(Transaction.findAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockTransactions);
    });

    it("should handle database errors", async () => {
      Transaction.findAll.mockRejectedValue(new Error("Database error"));

      await getAllTransactions(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Error fetching transactions",
        error: "Database error",
      });
    });
  });

  describe("markAsPaid", () => {
    beforeEach(() => {
      Transaction.findByPk.mockResolvedValue({
        id: 1,
        total_price: 10000,
        final_price: 10000,
        payment_method: "cash",
        status: "unpaid",
        members_id: null,
        save: jest.fn(),
        toJSON: jest.fn().mockReturnValue({
          id: 1,
          total_price: 10000,
          final_price: 10000,
          payment_method: "cash",
          status: "paid",
        }),
      });

      TransactionProduct.findAll.mockResolvedValue([
        {
          product_id: 1,
          quantity_sold: 1,
          price: 10000,
          used_points: 0,
          Product: {
            name: "Test Product",
          },
        },
      ]);
    });

    it("should mark transaction as paid with cash successfully", async () => {
      req.params.id = "1";
      req.body = {
        payment_method: "cash",
        cash_paid: 15000,
      };

      await markAsPaid(req, res);

      expect(Transaction.findByPk).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Transaction marked as paid successfully",
        transaction: expect.objectContaining({
          id: 1,
          change: 5000,
          items: expect.any(Array),
        }),
      });
    });

    it("should handle points payment", async () => {
      req.params.id = "1";
      req.body = {
        payment_method: "points",
        member_identifier: "08123456789",
      };

      Member.findOne.mockResolvedValue({
        id: 1,
        name: "Test Member",
        phone: "08123456789",
        total_points: 100,
        save: jest.fn(),
      });

      PointPromo.findAll.mockResolvedValue([
        {
          product_id: 1,
          point_cost: 10,
          is_active: true,
        },
      ]);

      TransactionProduct.update.mockResolvedValue();

      await markAsPaid(req, res);

      expect(Member.findOne).toHaveBeenCalled();
      expect(PointPromo.findAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Transaction paid using points successfully",
        transaction: expect.any(Object),
      });
    });

    it("should fail if transaction not found", async () => {
      req.params.id = "999";
      Transaction.findByPk.mockResolvedValue(null);

      await markAsPaid(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Transaction not found",
      });
    });

    it("should fail if transaction already paid", async () => {
      req.params.id = "1";
      Transaction.findByPk.mockResolvedValue({
        id: 1,
        status: "paid",
      });

      await markAsPaid(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Transaction already paid",
      });
    });

    it("should fail if insufficient points", async () => {
      req.params.id = "1";
      req.body = {
        payment_method: "points",
        member_identifier: "08123456789",
      };

      Member.findOne.mockResolvedValue({
        id: 1,
        name: "Test Member",
        phone: "08123456789",
        total_points: 5, // Insufficient points
        save: jest.fn(),
      });

      PointPromo.findAll.mockResolvedValue([
        {
          product_id: 1,
          point_cost: 10,
          is_active: true,
        },
      ]);

      await markAsPaid(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Insufficient points",
      });
    });

    it("should handle member loyalty points", async () => {
      req.params.id = "1";
      req.body = {
        payment_method: "cash",
        member_identifier: "08123456789",
        cash_paid: 15000,
      };

      Member.findOne.mockResolvedValue({
        id: 1,
        name: "Test Member",
        phone: "08123456789",
        total_spent: 0,
        total_points: 0,
        save: jest.fn(),
      });

      await markAsPaid(req, res);

      expect(Member.findOne).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should handle database errors", async () => {
      req.params.id = "1";
      req.body = {
        payment_method: "cash",
        cash_paid: 15000,
      };

      Transaction.findByPk.mockRejectedValue(new Error("Database error"));

      await markAsPaid(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Error updating transaction status",
        error: "Database error",
      });
    });
  });

  describe("cancelTransaction", () => {
    it("should cancel transaction successfully", async () => {
      req.params.id = "1";
      Transaction.findByPk.mockResolvedValue({
        id: 1,
        status: "unpaid",
      });
      Transaction.destroy.mockResolvedValue();

      await cancelTransaction(req, res);

      expect(Transaction.findByPk).toHaveBeenCalledWith("1");
      expect(Transaction.destroy).toHaveBeenCalledWith({ where: { id: "1" } });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Transaction canceled successfully",
      });
    });

    it("should return 404 if transaction not found", async () => {
      req.params.id = "999";
      Transaction.findByPk.mockResolvedValue(null);

      await cancelTransaction(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Transaction not found",
      });
    });

    it("should fail if transaction is already paid", async () => {
      req.params.id = "1";
      Transaction.findByPk.mockResolvedValue({
        id: 1,
        status: "paid",
      });

      await cancelTransaction(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Paid transactions cannot be canceled",
      });
    });

    it("should handle database errors", async () => {
      req.params.id = "1";
      Transaction.findByPk.mockRejectedValue(new Error("Database error"));

      await cancelTransaction(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Error canceling transaction",
        error: "Database error",
      });
    });
  });

  describe("Edge Cases", () => {
    it("should handle transaction with discount", async () => {
      req.body = {
        payment_method: "cash",
        discount: 10,
        products: [
          {
            product_id: 1,
            quantity_sold: 1,
          },
        ],
        cash_paid: 9000,
      };

      Product.findByPk.mockResolvedValue({
        id: 1,
        name: "Test Product",
        price: 10000,
      });

      ProductMaterial.findAll.mockResolvedValue([]);
      Transaction.create.mockResolvedValue({
        id: 1,
        total_price: 10000,
        final_price: 9000,
        payment_method: "cash",
        status: "unpaid",
      });

      await createTransaction(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
    });

    it("should handle multiple products in one transaction", async () => {
      req.body = {
        payment_method: "cash",
        products: [
          {
            product_id: 1,
            quantity_sold: 2,
          },
          {
            product_id: 2,
            quantity_sold: 1,
          },
        ],
        cash_paid: 30000,
      };

      Product.findByPk
        .mockResolvedValueOnce({
          id: 1,
          name: "Product 1",
          price: 10000,
        })
        .mockResolvedValueOnce({
          id: 2,
          name: "Product 2",
          price: 15000,
        });

      ProductMaterial.findAll.mockResolvedValue([]);
      Transaction.create.mockResolvedValue({
        id: 1,
        total_price: 35000,
        final_price: 35000,
        payment_method: "cash",
        status: "unpaid",
      });

      await createTransaction(req, res);

      expect(Product.findByPk).toHaveBeenCalledTimes(2);
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it("should handle zero cash payment (credit transaction)", async () => {
      req.body = {
        payment_method: "credit",
        products: [
          {
            product_id: 1,
            quantity_sold: 1,
          },
        ],
        cash_paid: 0,
      };

      Product.findByPk.mockResolvedValue({
        id: 1,
        name: "Test Product",
        price: 10000,
      });

      ProductMaterial.findAll.mockResolvedValue([]);
      Transaction.create.mockResolvedValue({
        id: 1,
        total_price: 10000,
        final_price: 10000,
        payment_method: "credit",
        status: "unpaid",
      });

      await createTransaction(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
    });
  });
});
