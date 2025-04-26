import request from "supertest";
import app from "../index.js";
import User from "../models/UserModel.js";

// Mock User model
jest.mock("../models/UserModel.js", () => ({
  findOne: jest.fn(),
  create: jest.fn(),
}));

describe("User Registration", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it("should register a new user successfully", async () => {
    User.findOne.mockResolvedValue(null); // Simulate no existing user
    User.create.mockResolvedValue({
      id: 1,
      name: "Test User",
      email: "testuser@example.com",
      role: "admin",
    });

    const res = await request(app).post("/register").send({
      name: "Test User",
      email: "testuser@example.com",
      password: "password123",
      confirmPassword: "password123",
      role: "admin",
    });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("message", "User created successfully");
    expect(res.body.user).toHaveProperty("email", "testuser@example.com");
  });

  it("should fail if passwords do not match", async () => {
    const res = await request(app).post("/register").send({
      name: "Mismatch User",
      email: "mismatch@example.com",
      password: "password123",
      confirmPassword: "differentpassword",
      role: "cashier",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("message", "Passwords do not match");
  });

  it("should fail if email already exists", async () => {
    User.findOne.mockResolvedValue({ email: "duplicate@example.com" }); // Simulate existing user

    const res = await request(app).post("/register").send({
      name: "Duplicate User",
      email: "duplicate@example.com",
      password: "password123",
      confirmPassword: "password123",
      role: "admin",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("message", "Email already exists");
  });
});
