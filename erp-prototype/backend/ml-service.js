const { spawn } = require('child_process');
const path = require('path');
const log4js = require('log4js');
const logger = log4js.getLogger();

class MLService {
    constructor() {
        this.modelPath = path.join(__dirname, '../optimization/dw_model.json');
        this.pythonScript = path.join(__dirname, '../optimization/model.py');
        this.initialized = false;
        this.initialize();
    }

    async initialize() {
        try {
            // Check if model file exists
            const fs = require('fs');
            if (!fs.existsSync(this.modelPath)) {
                logger.warn('ML model file not found, will train model on first prediction');
                this.initialized = true; // Allow initialization even without model
            } else {
                this.initialized = true;
                logger.info('ML service initialized successfully');
            }
        } catch (error) {
            logger.error('Failed to initialize ML service:', error);
            throw error;
        }
    }

    /**
     * Predict weight using the trained ML model
     * @param {Array<number>} features - [length, width, height, density_factor]
     * @returns {number} Predicted weight
     */
    async predictWeight(features) {
        if (!this.initialized) {
            throw new Error('ML service not initialized');
        }

        try {
            // Ensure model is trained
            await this.ensureModelExists();

            // Use Python script to make prediction
            const prediction = await this.callPythonModel(features);

            logger.info(`Weight prediction: ${prediction.toFixed(2)} for features: ${features.join(', ')}`);

            return prediction;

        } catch (error) {
            logger.error('Failed to predict weight:', error);

            // Fallback to simple volume-based calculation
            const [length, width, height, densityFactor] = features;
            const volume = length * width * height;
            const fallbackWeight = volume * densityFactor * 0.001; // Simple density calculation

            logger.info(`Using fallback calculation: ${fallbackWeight.toFixed(2)}`);
            return fallbackWeight;
        }
    }

    /**
     * Ensure the ML model exists, train if necessary
     */
    async ensureModelExists() {
        const fs = require('fs');

        if (fs.existsSync(this.modelPath)) {
            return; // Model already exists
        }

        logger.info('Training ML model...');

        try {
            // Check if training data exists
            const dataPath = path.join(__dirname, '../demo/synthetic_data.csv');
            if (!fs.existsSync(dataPath)) {
                throw new Error('Training data not found');
            }

            // Train the model using Python script
            await this.trainModel();

            logger.info('ML model trained successfully');

        } catch (error) {
            logger.error('Failed to train model:', error);
            throw error;
        }
    }

    /**
     * Train the ML model using Python
     */
    async trainModel() {
        return new Promise((resolve, reject) => {
            const pythonProcess = spawn('python', [
                path.join(__dirname, '../optimization/train.py')
            ], {
                cwd: path.join(__dirname, '../'),
                stdio: ['pipe', 'pipe', 'pipe']
            });

            let stdout = '';
            let stderr = '';

            pythonProcess.stdout.on('data', (data) => {
                stdout += data.toString();
            });

            pythonProcess.stderr.on('data', (data) => {
                stderr += data.toString();
            });

            pythonProcess.on('close', (code) => {
                if (code === 0) {
                    logger.info('Model training completed successfully');
                    resolve();
                } else {
                    logger.error('Model training failed:', stderr);
                    reject(new Error(`Training failed with code ${code}: ${stderr}`));
                }
            });

            pythonProcess.on('error', (error) => {
                logger.error('Error running training script:', error);
                reject(error);
            });
        });
    }

    /**
     * Call Python model for prediction
     * @param {Array<number>} features - Input features
     * @returns {number} Prediction result
     */
    async callPythonModel(features) {
        return new Promise((resolve, reject) => {
            // Create a temporary input for the Python script
            const inputData = features.join(',');

            const pythonProcess = spawn('python', [
                '-c',
                `
import sys
import json
import numpy as np
from optimization.model import predict_weight

# Read features from command line argument
features = [float(x) for x in sys.argv[1].split(',')]
result = predict_weight(features)

# Convert numpy types to native Python types for JSON serialization
if hasattr(result, 'item'):  # Convert numpy types
    result = result.item()

print(json.dumps({'prediction': result}))
                `,
                inputData
            ], {
                cwd: path.join(__dirname, '../'),
                stdio: ['pipe', 'pipe', 'pipe']
            });

            let stdout = '';
            let stderr = '';

            pythonProcess.stdout.on('data', (data) => {
                stdout += data.toString();
            });

            pythonProcess.stderr.on('data', (data) => {
                stderr += data.toString();
            });

            pythonProcess.on('close', (code) => {
                if (code === 0) {
                    try {
                        const result = JSON.parse(stdout.trim());
                        resolve(result.prediction);
                    } catch (parseError) {
                        logger.error('Failed to parse Python output:', stdout);
                        reject(parseError);
                    }
                } else {
                    logger.error('Python prediction failed:', stderr);
                    reject(new Error(`Prediction failed with code ${code}: ${stderr}`));
                }
            });

            pythonProcess.on('error', (error) => {
                logger.error('Error running Python prediction:', error);
                reject(error);
            });
        });
    }

    /**
     * Get model information and statistics
     * @returns {Object} Model details
     */
    async getModelInfo() {
        const fs = require('fs');

        const modelInfo = {
            modelPath: this.modelPath,
            exists: fs.existsSync(this.modelPath),
            pythonScript: this.pythonScript,
            scriptExists: fs.existsSync(this.pythonScript + '.py') || fs.existsSync(this.pythonScript),
            status: this.initialized ? 'initialized' : 'not_initialized'
        };

        if (modelInfo.exists) {
            try {
                const stats = fs.statSync(this.modelPath);
                modelInfo.lastModified = stats.mtime;
                modelInfo.size = stats.size;
            } catch (error) {
                logger.error('Error getting model file stats:', error);
            }
        }

        return modelInfo;
    }

    /**
     * Check if service is ready for predictions
     * @returns {boolean} Service readiness
     */
    async isReady() {
        return this.initialized;
    }

    /**
     * Cleanup resources
     */
    async cleanup() {
        logger.info('ML service cleanup completed');
    }
}

module.exports = { MLService };
