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
    const result = await fabricService.calculateTariff("item_tariff_test", "org1");
    expect(result).toHaveProperty("totalTariff");
    expect(result).toHaveProperty("appliedPolicies");
  });

  test("lists disputes with optional filter", async () => {
    const disputes = await fabricService.getAllDisputes("open");
    expect(Array.isArray(disputes)).toBe(true);
  });
});
