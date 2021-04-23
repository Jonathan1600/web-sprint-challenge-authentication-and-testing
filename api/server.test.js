const request = require("supertest");
const db = require("../data/dbConfig");
const server = require("./server");
const jokes = require("./jokes/jokes-data");

const jonathan = {
  password: "1234",
  username: "Jonathan"
}

// Write your tests here
test('sanity', () => {
  expect(true).toBe(true)
})

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
});

beforeEach(async () => {
  await db("users").truncate()
});

afterAll(async () => {
  await db.destroy()
});

describe("server", () => {
  describe("[POST] /api/auth/register", () => {
    it("responds with 201 ok after creating a new user", async () => {
      const res = await request(server).post("/api/auth/register").send(jonathan);
      expect(res.status).toBe(201);
    });
    it("returns the right data", async () => {
      const res = await request(server).post("/api/auth/register").send(jonathan);
      expect(res.body).toHaveProperty("id", "password", "username")
    })
  });

  describe("[POST] /api/auth/login", () => {
    it("responds with a token", async () => {
      await request(server).post("/api/auth/register").send(jonathan);
      const res = await request(server).post("/api/auth/login").send(jonathan);
      expect(res.body).toHaveProperty("token");
    });
    it("returns the right welcome response", async () => {
      await request(server).post("/api/auth/register").send(jonathan);
      const res = await request(server).post("/api/auth/login").send(jonathan);
      expect(res.body.message).toBe(`welcome, ${jonathan.username}`)
    })
  });

  describe("[GET] /api/jokes", () => {
    it("it requires authentication token", async () => {
      const res = await request(server).get("/api/jokes")
      expect(res.body.message).toBe("token required")
    });
    it("returns jokes when token is given", async () => {
      await request(server).post("/api/auth/register").send(jonathan);
      const login = await request(server).post("/api/auth/login").send(jonathan);
      const res = await request(server).get("/api/jokes").set('Authorization', login.body.token);
      expect(res.body).toEqual(jokes)
    });
  });
})

