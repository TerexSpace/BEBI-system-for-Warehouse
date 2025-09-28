const request = require('supertest');
const app = require('../backend/app');
const { FabricService } = require('../backend/fabric-service');
const { MLService } = require('../backend/ml-service');

describe('Warehouse Contract Tests', () => {
    let fabricService;
    let mlService;

    beforeAll(async () => {
        // Initialize services
        fabricService = new FabricService();
        mlService = new MLService();

        // Wait for services to initialize
        await new Promise(resolve => setTimeout(resolve, 200));
    });

    describe('Backend API Tests', () => {
        test('GET /health should return healthy status', async () => {
            const response = await request(app)
                .get('/health')
                .expect(200);

            expect(response.body).toHaveProperty('status', 'healthy');
            expect(response.body).toHaveProperty('service');
            expect(response.body).toHaveProperty('timestamp');
        });

        test('GET /api/warehouse/analytics should return analytics data', async () => {
            const response = await request(app)
                .get('/api/warehouse/analytics')
                .expect(200);

            expect(response.body).toHaveProperty('totalItems');
            expect(response.body).toHaveProperty('systemHealth');
            expect(response.body).toHaveProperty('timestamp');
        });

        test('POST /api/warehouse/items should record item with valid data', async () => {
            const itemData = {
                id: 'test-item-001',
                length: 15.5,
                width: 8.2,
                height: 12.1,
                weight: 4.5,
                organizationId: 'org1'
            };

            const response = await request(app)
                .post('/api/warehouse/items')
                .send(itemData)
                .expect(200);

            expect(response.body).toHaveProperty('success', true);
            expect(response.body).toHaveProperty('itemId', 'test-item-001');
            expect(response.body).toHaveProperty('predictedWeight');
            expect(response.body).toHaveProperty('timestamp');
        });

        test('POST /api/warehouse/items should fail with missing required fields', async () => {
            const invalidData = {
                id: 'test-item-002'
                // Missing length, width, height
            };

            const response = await request(app)
                .post('/api/warehouse/items')
                .send(invalidData)
                .expect(400);

            expect(response.body).toHaveProperty('error');
            expect(response.body).toHaveProperty('message');
        });

        test('GET /api/warehouse/items/:id should retrieve item data', async () => {
            const response = await request(app)
                .get('/api/warehouse/items/test-item-001')
                .expect(200);

            expect(response.body).toHaveProperty('itemId', 'test-item-001');
            expect(response.body).toHaveProperty('measurements');
            expect(response.body).toHaveProperty('timestamp');
        });

        test('GET /api/warehouse/items/:id should return 404 for non-existent item', async () => {
            const response = await request(app)
                .get('/api/warehouse/items/non-existent-item')
                .expect(404);

            expect(response.body).toHaveProperty('error', 'Item not found');
            expect(response.body).toHaveProperty('message');
        });

        test('POST /api/warehouse/optimize should optimize items', async () => {
            const optimizationData = {
                items: [
                    {
                        id: 'item-1',
                        length: 20.0,
                        width: 10.0,
                        height: 15.0,
                        densityFactor: 0.85
                    },
                    {
                        id: 'item-2',
                        length: 25.0,
                        width: 12.0,
                        height: 18.0,
                        densityFactor: 0.90
                    }
                ]
            };

            const response = await request(app)
                .post('/api/warehouse/optimize')
                .send(optimizationData)
                .expect(200);

            expect(response.body).toHaveProperty('success', true);
            expect(response.body).toHaveProperty('optimizationResults');
            expect(response.body.optimizationResults).toHaveLength(2);
            expect(response.body).toHaveProperty('totalItems', 2);
            expect(response.body).toHaveProperty('timestamp');

            // Check first optimization result
            const firstResult = response.body.optimizationResults[0];
            expect(firstResult).toHaveProperty('itemId');
            expect(firstResult).toHaveProperty('predictedWeight');
            expect(firstResult).toHaveProperty('dimensions');
            expect(firstResult).toHaveProperty('confidence');
        });

        test('POST /api/warehouse/optimize should fail with invalid input', async () => {
            const invalidData = {
                items: [] // Empty array
            };

            const response = await request(app)
                .post('/api/warehouse/optimize')
                .send(invalidData)
                .expect(400);

            expect(response.body).toHaveProperty('error');
            expect(response.body).toHaveProperty('message');
        });

        test('GET /api/warehouse/health should return detailed health status', async () => {
            const response = await request(app)
                .get('/api/warehouse/health')
                .expect(200);

            expect(response.body).toHaveProperty('blockchain');
            expect(response.body).toHaveProperty('ml_model');
            expect(response.body).toHaveProperty('overall');
            expect(response.body.overall).toHaveProperty('status');

            // Should have blockchain and ML model status
            expect(['healthy', 'unhealthy', 'unknown']).toContain(response.body.blockchain.status);
            expect(['healthy', 'unhealthy', 'unknown']).toContain(response.body.ml_model.status);
        });
    });

    describe('Service Integration Tests', () => {
        test('FabricService should be initialized', async () => {
            const isConnected = await fabricService.isConnected();
            expect(isConnected).toBe(true);
        });

        test('FabricService should record measurements', async () => {
            const result = await fabricService.recordMeasurement(
                'test-item-003',
                10.0,
                5.0,
                8.0,
                2.5
            );

            expect(result).toHaveProperty('success', true);
            expect(result).toHaveProperty('transactionId');
            expect(result).toHaveProperty('blockNumber');
            expect(result).toHaveProperty('timestamp');
        });

        test('FabricService should retrieve measurements', async () => {
            const measurement = await fabricService.getMeasurement('test-item-003');

            expect(measurement).toHaveProperty('id', 'test-item-003');
            expect(measurement).toHaveProperty('length');
            expect(measurement).toHaveProperty('width');
            expect(measurement).toHaveProperty('height');
            expect(measurement).toHaveProperty('weight');
            expect(measurement).toHaveProperty('timestamp');
        });

        test('FabricService should return ledger height', async () => {
            const height = await fabricService.getLedgerHeight();
            expect(typeof height).toBe('number');
            expect(height).toBeGreaterThan(0);
        });

        test('MLService should be initialized', async () => {
            const isReady = await mlService.isReady();
            expect(isReady).toBe(true);
        });

        test('MLService should predict weight', async () => {
            const features = [15.0, 8.0, 12.0, 0.85];
            const prediction = await mlService.predictWeight(features);

            expect(typeof prediction).toBe('number');
            expect(prediction).toBeGreaterThan(0);
        });

        test('MLService should return model info', async () => {
            const modelInfo = await mlService.getModelInfo();

            expect(modelInfo).toHaveProperty('modelPath');
            expect(modelInfo).toHaveProperty('exists');
            expect(modelInfo).toHaveProperty('status');
        });
    });

    describe('Error Handling Tests', () => {
        test('Should handle malformed JSON gracefully', async () => {
            const response = await request(app)
                .post('/api/warehouse/items')
                .set('Content-Type', 'application/json')
                .send('{ invalid json }')
                .expect(400);
        });

        test('Should handle missing routes with 404', async () => {
            const response = await request(app)
                .get('/api/nonexistent/route')
                .expect(404);

            expect(response.body).toHaveProperty('error', 'Not found');
            expect(response.body).toHaveProperty('message');
        });

        test('Should handle service unavailability', async () => {
            // Temporarily disconnect services to test error handling
            await fabricService.disconnect();

            const response = await request(app)
                .post('/api/warehouse/items')
                .send({
                    id: 'test-item-004',
                    length: 10.0,
                    width: 5.0,
                    height: 8.0
                })
                .expect(503);

            expect(response.body).toHaveProperty('error', 'Service unavailable');

            // Reconnect for other tests
            fabricService = new FabricService();
            await new Promise(resolve => setTimeout(resolve, 100));
        });
    });

    afterAll(async () => {
        // Cleanup
        if (fabricService) {
            await fabricService.disconnect();
        }
        if (mlService) {
            await mlService.cleanup();
        }
    });
});

describe('Performance Tests', () => {
    test('API endpoints should respond within reasonable time', async () => {
        const startTime = Date.now();

        await request(app)
            .get('/health')
            .expect(200);

        const responseTime = Date.now() - startTime;
        expect(responseTime).toBeLessThan(1000); // Should respond within 1 second
    });

    test('ML predictions should be fast', async () => {
        const features = [20.0, 10.0, 15.0, 0.85];
        const startTime = Date.now();

        await mlService.predictWeight(features);

        const predictionTime = Date.now() - startTime;
        expect(predictionTime).toBeLessThan(5000); // Should predict within 5 seconds
    });
});
