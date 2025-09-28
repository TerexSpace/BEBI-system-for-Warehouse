const express = require('express');
const router = express.Router();
const { FabricService } = require('./fabric-service');
const { MLService } = require('./ml-service');
const log4js = require('log4js');
const logger = log4js.getLogger();
const path = require('path');
const { spawn } = require('child_process');

// Initialize services
let fabricService;
let mlService;

try {
    fabricService = new FabricService();
    mlService = new MLService();
    logger.info('Services initialized successfully');
} catch (error) {
    logger.error('Failed to initialize services:', error);
}

// Middleware to check if services are available
const checkServices = (req, res, next) => {
    if (!fabricService || !mlService) {
        return res.status(503).json({
            error: 'Service unavailable',
            message: 'Blockchain or ML services not initialized'
        });
    }
    next();
};

// Warehouse item management endpoints

/**
 * POST /api/warehouse/items
 * Record a new warehouse item with measurements
 */
router.post('/items', checkServices, async (req, res) => {
    try {
        const { id, length, width, height, weight, organizationId } = req.body;

        if (!id || !length || !width || !height) {
            return res.status(400).json({
                error: 'Missing required fields',
                message: 'id, length, width, height are required'
            });
        }

        // Use ML service to predict weight if not provided
        let predictedWeight = weight;
        if (!weight) {
            predictedWeight = mlService.predictWeight([length, width, height, 0.85]); // Default density factor
        }

        // Record measurement on blockchain
        const result = await fabricService.recordMeasurement(id, length, width, height, predictedWeight);

        logger.info(`Item recorded: ${id}`, { length, width, height, predictedWeight });

        res.json({
            success: true,
            itemId: id,
            predictedWeight: predictedWeight,
            blockchainResult: result,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        logger.error('Error recording item:', error);
        res.status(500).json({
            error: 'Failed to record item',
            message: error.message
        });
    }
});

/**
 * GET /api/warehouse/items/:id
 * Retrieve item measurements from blockchain
 */
router.get('/items/:id', checkServices, async (req, res) => {
    try {
        const { id } = req.params;

        const measurements = await fabricService.getMeasurement(id);

        if (!measurements) {
            return res.status(404).json({
                error: 'Item not found',
                message: `No measurements found for item ${id}`
            });
        }

        res.json({
            itemId: id,
            measurements: measurements,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        logger.error('Error retrieving item:', error);
        res.status(500).json({
            error: 'Failed to retrieve item',
            message: error.message
        });
    }
});

/**
 * GET /api/warehouse/analytics
 * Get warehouse analytics and KPIs
 */
router.get('/analytics', async (req, res) => {
    try {
        // In a real implementation, this would aggregate data from multiple sources
        const analytics = {
            totalItems: 0,
            avgProcessingTime: 0,
            systemHealth: 'good',
            blockchainStatus: 'connected',
            mlModelStatus: 'loaded',
            timestamp: new Date().toISOString()
        };

        // Mock some analytics data
        if (mlService) {
            analytics.mlModelAccuracy = 0.95; // Mock accuracy
        }

        if (fabricService) {
            analytics.blockchainNetwork = 'hyperledger-fabric';
            analytics.ledgerHeight = await fabricService.getLedgerHeight();
        }

        res.json(analytics);

    } catch (error) {
        logger.error('Error retrieving analytics:', error);
        res.status(500).json({
            error: 'Failed to retrieve analytics',
            message: error.message
        });
    }
});

/**
 * POST /api/warehouse/optimize
 * Optimize warehouse operations using ML
 */
router.post('/optimize', checkServices, async (req, res) => {
    try {
        const { items } = req.body;

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                error: 'Invalid input',
                message: 'items array is required and cannot be empty'
            });
        }

        const optimizationResults = [];

        for (const item of items) {
            const { length, width, height, densityFactor = 0.85 } = item;

            // Get ML prediction for optimal weight
            const predictedWeight = mlService.predictWeight([length, width, height, densityFactor]);

            optimizationResults.push({
                itemId: item.id || `item_${optimizationResults.length + 1}`,
                originalWeight: item.weight,
                predictedWeight: predictedWeight,
                dimensions: { length, width, height },
                densityFactor: densityFactor,
                confidence: 0.92 + Math.random() * 0.06 // Mock confidence score
            });
        }

        logger.info(`Optimization completed for ${items.length} items`);

        res.json({
            success: true,
            optimizationResults: optimizationResults,
            totalItems: items.length,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        logger.error('Error during optimization:', error);
        res.status(500).json({
            error: 'Optimization failed',
            message: error.message
        });
    }
});

/**
 * GET /api/warehouse/health
 * Detailed health check for warehouse services
 */
router.get('/health', async (req, res) => {
    const health = {
        blockchain: { status: 'unknown' },
        ml_model: { status: 'unknown' },
        overall: { status: 'unknown' }
    };

    try {
        // Check blockchain connectivity
        if (fabricService) {
            try {
                await fabricService.getLedgerHeight();
                health.blockchain.status = 'healthy';
            } catch (error) {
                health.blockchain.status = 'unhealthy';
                health.blockchain.error = error.message;
            }
        }

        // Check ML model
        if (mlService) {
            try {
                // Simple prediction test
                const testPrediction = mlService.predictWeight([10, 10, 10, 0.85]);
                health.ml_model.status = 'healthy';
                health.ml_model.lastPrediction = testPrediction;
            } catch (error) {
                health.ml_model.status = 'unhealthy';
                health.ml_model.error = error.message;
            }
        }

        // Overall health
        const unhealthyServices = Object.values(health).filter(service => service.status === 'unhealthy');
        health.overall.status = unhealthyServices.length === 0 ? 'healthy' : 'degraded';

        const statusCode = health.overall.status === 'healthy' ? 200 : 503;
        res.status(statusCode).json(health);

    } catch (error) {
        logger.error('Health check failed:', error);
        health.overall.status = 'unhealthy';
        health.overall.error = error.message;
        res.status(503).json(health);
    }
});

// Serve static plots
const plotsDir = path.join(__dirname, '../demo/plots');
router.use('/plots', express.static(plotsDir));

// Generate plots on demand
router.post('/plots/generate', async (req, res) => {
    try {
        const scriptPath = path.join(__dirname, '../demo/plot_kpis.py');
        const python = spawn('python', [scriptPath], { cwd: path.join(__dirname, '../') });

        let stdout = '';
        let stderr = '';
        python.stdout.on('data', d => (stdout += d.toString()));
        python.stderr.on('data', d => (stderr += d.toString()));
        python.on('close', code => {
            if (code === 0) {
                res.json({ success: true, message: 'Plots generated', stdout });
            } else {
                res.status(500).json({ success: false, error: stderr });
            }
        });
    } catch (err) {
        logger.error('Plot generation failed', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// GET alias for convenience
router.get('/plots/generate', async (req, res) => {
    const scriptPath = path.join(__dirname, '../demo/plot_kpis.py');
    const python = spawn('python', [scriptPath], { cwd: path.join(__dirname, '../') });

    let stdout = '';
    let stderr = '';
    python.stdout.on('data', d => (stdout += d.toString()));
    python.stderr.on('data', d => (stderr += d.toString()));
    python.on('close', code => {
        if (code === 0) {
            res.json({ success: true, message: 'Plots generated', stdout });
        } else {
            res.status(500).json({ success: false, error: stderr });
        }
    });
});

module.exports = router;
