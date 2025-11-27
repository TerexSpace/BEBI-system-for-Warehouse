const EventEmitter = require("events");
const request = require("supertest");
const childProcess = require("child_process");

const app = require("../backend/app");
const routes = require("../backend/routes");
const { FabricService } = require("../backend/fabric-service");
const { MLService } = require("../backend/ml-service");

jest.setTimeout(20000);

const originalServices = routes.__private.getServices();

afterEach(async () => {
  routes.__private.setServices(originalServices);
  jest.restoreAllMocks();
  await new Promise((resolve) => setTimeout(resolve, 50));
});

describe("Route error and edge paths", () => {
  test("returns 503 when services are not initialized", async () => {
    routes.__private.setServices({
      fabricService: { initialized: false },
      mlService: { initialized: false }
    });

    const res = await request(app)
      .post("/api/warehouse/items")
      .send({ id: "missing-services", length: 1, width: 1, height: 1 })
      .expect(503);

    expect(res.body).toHaveProperty("error", "Service unavailable");
  });

  test("returns 500 when recordMeasurement fails", async () => {
    const failingFabric = {
      initialized: true,
      recordMeasurement: jest.fn().mockRejectedValue(new Error("record failed"))
    };
    const stubMl = { initialized: true, predictWeight: jest.fn().mockReturnValue(1) };

    routes.__private.setServices({ fabricService: failingFabric, mlService: stubMl });

    await request(app)
      .post("/api/warehouse/items")
      .send({ id: "fail-item", length: 2, width: 2, height: 2 })
      .expect(500);

    expect(failingFabric.recordMeasurement).toHaveBeenCalled();
  });

  test("optimize endpoint returns 500 when ML prediction throws", async () => {
    const fabric = new FabricService();
    await new Promise((resolve) => setTimeout(resolve, 100));
    const ml = {
      initialized: true,
      predictWeight: jest.fn(() => {
        throw new Error("prediction failed");
      })
    };

    routes.__private.setServices({ fabricService: fabric, mlService: ml });

    await request(app)
      .post("/api/warehouse/optimize")
      .send({ items: [{ id: "bad-ml", length: 1, width: 1, height: 1 }] })
      .expect(500);
  });

  test("health endpoint degrades when ML fails", async () => {
    const fabric = new FabricService();
    await new Promise((resolve) => setTimeout(resolve, 100));
    const ml = {
      initialized: true,
      predictWeight: jest.fn(() => {
        throw new Error("health check failed");
      })
    };

    routes.__private.setServices({ fabricService: fabric, mlService: ml });

    const res = await request(app).get("/api/warehouse/health").expect(503);
    expect(res.body.ml_model.status).toBe("unhealthy");
  });

  test("plot generation surfaces errors", async () => {
    jest.spyOn(childProcess, "spawn").mockImplementation(() => {
      const proc = new EventEmitter();
      proc.stdout = new EventEmitter();
      proc.stderr = new EventEmitter();
      process.nextTick(() => {
        proc.stderr.emit("data", "failed");
        proc.emit("close", 1);
      });
      return proc;
    });

    await request(app)
      .post("/api/warehouse/plots/generate")
      .expect(200);
  });

  test("tariff validation returns 400 on missing fields", async () => {
    const fabric = new FabricService();
    const ml = new MLService();
    routes.__private.setServices({ fabricService: fabric, mlService: ml });
    await new Promise((resolve) => setTimeout(resolve, 100));

    await request(app)
      .post("/api/warehouse/tariffs")
      .send({ name: "invalid" })
      .expect(400);
  });

  test("dispute validation returns 400 on missing fields", async () => {
    const fabric = new FabricService();
    const ml = new MLService();
    routes.__private.setServices({ fabricService: fabric, mlService: ml });
    await new Promise((resolve) => setTimeout(resolve, 100));

    await request(app)
      .post("/api/warehouse/disputes")
      .send({ id: "bad-dispute" })
      .expect(400);
  });
});
