const request = require("supertest");
const app = require("../src/index");

test("health endpoint returns ok", async () => {
const res = await request(app).get("/api/v1/health");
expect(res.statusCode).toBe(200);
});
