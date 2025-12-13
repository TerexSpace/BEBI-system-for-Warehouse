const { FabricService } = require("../backend/fabric-service");

jest.setTimeout(20000);

describe("FabricService coverage", () => {
  let fabricService;

  beforeAll(async () => {
    fabricService = new FabricService();
    await new Promise((resolve) => setTimeout(resolve, 150));
  });

  test("returns network info", async () => {
    const info = await fabricService.getNetworkInfo();
    expect(info).toHaveProperty("networkName");
    expect(info).toHaveProperty("channelName");
  });

  test("calculates tariffs with mock policies", async () => {
    await fabricService.recordMeasurement("item_tariff_test", 1, 1, 1, 1, "org1");
    await fabricService.createTariffPolicy("policy_test", "Test Policy", "desc", 0.1, "weight", "shipping", "tester");
    const result = await fabricService.calculateTariff("item_tariff_test", "org1");
    expect(result).toHaveProperty("totalTariff");
    expect(result).toHaveProperty("appliedPolicies");
  });

  test("lists disputes with optional filter", async () => {
    await fabricService.createDispute("dispute_test", "item_tariff_test", "measurement", "desc", "user1");
    const disputes = await fabricService.getAllDisputes("open");
    expect(Array.isArray(disputes)).toBe(true);
    expect(disputes.length).toBeGreaterThan(0);
  });
});
