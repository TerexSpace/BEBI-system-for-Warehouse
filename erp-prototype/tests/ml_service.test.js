const { MLService } = require("../backend/ml-service");

jest.setTimeout(20000);

describe("MLService coverage", () => {
  test("returns model info with expected fields", async () => {
    const mlService = new MLService();
    const info = await mlService.getModelInfo();

    expect(info).toHaveProperty("modelPath");
    expect(info).toHaveProperty("status");
  });

  test("falls back to volume-based calculation when Python prediction fails", async () => {
    const mlService = new MLService();

    jest.spyOn(mlService, "ensureModelExists").mockResolvedValue();
    jest.spyOn(mlService, "callPythonModel").mockRejectedValue(new Error("predict failure"));

    const predicted = await mlService.predictWeight([10, 5, 4, 0.8]);
    expect(typeof predicted).toBe("number");
    expect(predicted).toBeGreaterThan(0);
  });
});
