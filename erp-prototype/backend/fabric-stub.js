#!/usr/bin/env node

/**
 * Hyperledger Fabric Network Stub
 *
 * This script simulates a Hyperledger Fabric network for development and testing.
 * It provides mock blockchain functionality without requiring a full Fabric setup.
 */

const express = require('express');
const app = express();
const PORT = 7050;

app.use(express.json());

console.log('🚀 Starting Hyperledger Fabric Network Stub...');
console.log(`📡 Network will be available at http://localhost:${PORT}`);

// Mock ledger state
const mockLedger = {
    currentBlock: 1000,
    transactions: new Map(),
    blocks: new Map()
};

// Mock chaincode functions
const mockChaincode = {
    RecordMeasurement: (id, length, width, height, weight) => {
        const txId = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const blockNumber = mockLedger.currentBlock;

        const record = {
            id,
            length: parseFloat(length),
            width: parseFloat(width),
            height: parseFloat(height),
            weight: parseFloat(weight),
            timestamp: new Date().toISOString(),
            transactionId: txId,
            blockNumber: blockNumber
        };

        // Store in mock ledger
        mockLedger.transactions.set(id, record);
        mockLedger.blocks.set(blockNumber, {
            number: blockNumber,
            timestamp: new Date().toISOString(),
            transactions: [txId]
        });

        mockLedger.currentBlock++;

        return {
            success: true,
            transactionId: txId,
            blockNumber: blockNumber
        };
    },

    GetMeasurement: (id) => {
        return mockLedger.transactions.get(id) || null;
    }
};

// API endpoints to simulate Fabric network

/**
 * GET /health
 * Health check endpoint
 */
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        network: 'fabric-stub',
        version: '1.0.0',
        currentBlock: mockLedger.currentBlock,
        totalTransactions: mockLedger.transactions.size
    });
});

/**
 * POST /chaincode/RecordMeasurement
 * Simulate recording a measurement transaction
 */
app.post('/chaincode/RecordMeasurement', (req, res) => {
    try {
        const { id, length, width, height, weight } = req.body;

        if (!id || !length || !width || !height || !weight) {
            return res.status(400).json({
                error: 'Missing required parameters',
                required: ['id', 'length', 'width', 'height', 'weight']
            });
        }

        const result = mockChaincode.RecordMeasurement(id, length, width, height, weight);

        console.log(`📦 Recorded measurement: ${id} (${length}x${width}x${height}, ${weight}kg)`);

        res.json({
            result: 'SUCCESS',
            transactionId: result.transactionId,
            blockNumber: result.blockNumber,
            payload: {
                id,
                length: parseFloat(length),
                width: parseFloat(width),
                height: parseFloat(height),
                weight: parseFloat(weight)
            }
        });

    } catch (error) {
        console.error('❌ Error recording measurement:', error);
        res.status(500).json({
            error: 'Transaction failed',
            message: error.message
        });
    }
});

/**
 * GET /chaincode/GetMeasurement/:id
 * Simulate querying a measurement from the ledger
 */
app.get('/chaincode/GetMeasurement/:id', (req, res) => {
    try {
        const { id } = req.params;

        const measurement = mockChaincode.GetMeasurement(id);

        if (!measurement) {
            return res.status(404).json({
                error: 'Measurement not found',
                message: `No measurement found for ID: ${id}`
            });
        }

        console.log(`🔍 Retrieved measurement: ${id}`);

        res.json({
            result: 'SUCCESS',
            payload: measurement
        });

    } catch (error) {
        console.error('❌ Error retrieving measurement:', error);
        res.status(500).json({
            error: 'Query failed',
            message: error.message
        });
    }
});

/**
 * GET /ledger/height
 * Get current ledger height
 */
app.get('/ledger/height', (req, res) => {
    res.json({
        height: mockLedger.currentBlock,
        timestamp: new Date().toISOString()
    });
});

/**
 * GET /ledger/block/:number
 * Get block information
 */
app.get('/ledger/block/:number', (req, res) => {
    try {
        const blockNumber = parseInt(req.params.number);
        const block = mockLedger.blocks.get(blockNumber);

        if (!block) {
            return res.status(404).json({
                error: 'Block not found',
                message: `Block ${blockNumber} not found in ledger`
            });
        }

        res.json(block);

    } catch (error) {
        console.error('❌ Error retrieving block:', error);
        res.status(500).json({
            error: 'Query failed',
            message: error.message
        });
    }
});

/**
 * GET /network/info
 * Get network information
 */
app.get('/network/info', (req, res) => {
    res.json({
        name: 'warehouse-network-stub',
        version: '1.0.0',
        organizations: [
            {
                id: 'org1',
                name: 'WarehouseOrg1',
                mspId: 'WarehouseOrg1MSP'
            },
            {
                id: 'org2',
                name: 'WarehouseOrg2',
                mspId: 'WarehouseOrg2MSP'
            }
        ],
        channels: [
            {
                id: 'warehouse-channel',
                name: 'Warehouse Channel'
            }
        ],
        chaincodes: [
            {
                name: 'warehouse-contract',
                version: '1.0.0',
                language: 'go'
            }
        ],
        status: 'running',
        mode: 'development'
    });
});

/**
 * POST /admin/reset
 * Reset the mock ledger (for testing)
 */
app.post('/admin/reset', (req, res) => {
    mockLedger.currentBlock = 1000;
    mockLedger.transactions.clear();
    mockLedger.blocks.clear();

    console.log('🔄 Mock ledger reset');

    res.json({
        message: 'Ledger reset successfully',
        newHeight: mockLedger.currentBlock
    });
});

// Start the server
app.listen(PORT, () => {
    console.log('✅ Fabric Network Stub started successfully!');
    console.log(`🌐 API available at: http://localhost:${PORT}`);
    console.log(`📊 Ledger height: ${mockLedger.currentBlock}`);
    console.log('📋 Available endpoints:');
    console.log('   GET  /health              - Health check');
    console.log('   POST /chaincode/RecordMeasurement - Record measurement');
    console.log('   GET  /chaincode/GetMeasurement/:id - Get measurement');
    console.log('   GET  /ledger/height       - Get ledger height');
    console.log('   GET  /ledger/block/:num   - Get block info');
    console.log('   GET  /network/info        - Get network info');
    console.log('   POST /admin/reset         - Reset ledger (dev only)');
    console.log('');
    console.log('💡 This is a development stub - replace with real Fabric network for production');
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down Fabric Network Stub...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Shutting down Fabric Network Stub...');
    process.exit(0);
});

module.exports = app;
