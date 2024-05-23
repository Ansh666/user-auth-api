const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Auth Endpoints", () => {
  it("should register a new user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      username: "testuser",
      email: "testuser@example.com",
      password: "password123",
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("token");
  });

  it("should login a user", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "testuser@example.com",
      password: "password123",
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("token");
  });

  it("should get user profile", async () => {
    const loginRes = await request(app).post("/api/auth/login").send({
      email: "testuser@example.com",
      password: "password123",
    });

    const res = await request(app)
      .get("/api/auth/profile")
      .set("Authorization", `Bearer ${loginRes.body.token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("email", "testuser@example.com");
  });
});
