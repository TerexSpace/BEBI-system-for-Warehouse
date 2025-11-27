/* eslint-disable global-require */
jest.mock("child_process", () => {
  const EventEmitter = require("events");
  return {
    spawn: () => {
      const proc = new EventEmitter();
      proc.stdout = new EventEmitter();
      proc.stderr = new EventEmitter();
      proc.kill = jest.fn();
      process.nextTick(() => {
        proc.stdout.emit("data", "ok");
        proc.emit("close", 0);
      });
      return proc;
    }
  };
});

const request = require("supertest");
const app = require("../backend/app");

jest.setTimeout(20000);

beforeAll(async () => {
  await new Promise((resolve) => setTimeout(resolve, 200));
});

describe("Tariff and dispute routes", () => {
  const tariffId = `tariff_${Date.now()}`;
  const disputeId = `dispute_${Date.now()}`;

  test("creates and retrieves a tariff policy", async () => {
    const createRes = await request(app)
      .post("/api/warehouse/tariffs")
      .send({
        id: tariffId,
        name: "Weight-Based Shipping",
        description: "Test tariff",
        rate: 0.15,
        unit: "weight",
        category: "shipping",
        createdBy: "tester"
      })
      .expect(200);

    expect(createRes.body).toHaveProperty("success", true);
    expect(createRes.body).toHaveProperty("policyId", tariffId);

    const getRes = await request(app)
      .get(`/api/warehouse/tariffs/${tariffId}`)
      .expect(200);

    expect(getRes.body).toHaveProperty("policyId", tariffId);
    expect(getRes.body).toHaveProperty("policy");
  });

  test("calculates tariff for an item", async () => {
    const res = await request(app)
      .post("/api/warehouse/tariffs/calculate")
      .send({ itemId: "item_for_tariff", organizationId: "org1" })
      .expect(200);

    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("calculation");
  });

  test("creates, updates, and lists disputes", async () => {
    const createRes = await request(app)
      .post("/api/warehouse/disputes")
      .send({
        id: disputeId,
        itemId: "item_1",
        disputeType: "measurement",
        description: "Weight discrepancy",
        raisedBy: "customer_1"
      })
      .expect(200);

    expect(createRes.body).toHaveProperty("success", true);
    expect(createRes.body).toHaveProperty("disputeId", disputeId);

    const getRes = await request(app)
      .get(`/api/warehouse/disputes/${disputeId}`)
      .expect(200);

    expect(getRes.body).toHaveProperty("disputeId", disputeId);

    const updateRes = await request(app)
      .put(`/api/warehouse/disputes/${disputeId}/status`)
      .send({ status: "resolved", resolution: "Checked", assignedTo: "admin_1" })
      .expect(200);

    expect(updateRes.body).toHaveProperty("success", true);

    const listRes = await request(app)
      .get("/api/warehouse/disputes")
      .expect(200);

    expect(listRes.body).toHaveProperty("disputes");
    expect(Array.isArray(listRes.body.disputes)).toBe(true);
  });
});

describe("Plot generation endpoints", () => {
  test("POST /api/warehouse/plots/generate returns success", async () => {
    const res = await request(app)
      .post("/api/warehouse/plots/generate")
      .expect(200);

    expect(res.body).toHaveProperty("success", true);
  });

  test("GET /api/warehouse/plots/generate returns success", async () => {
    const res = await request(app)
      .get("/api/warehouse/plots/generate")
      .expect(200);

    expect(res.body).toHaveProperty("success", true);
  });
});
