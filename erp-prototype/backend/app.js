const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const log4js = require('log4js');

const app = express();
const PORT = process.env.PORT || 3000;

// Configure logging
log4js.configure({
    appenders: {
        file: { type: 'file', filename: 'logs/app.log' },
        console: { type: 'console' }
    },
    categories: {
        default: { appenders: ['file', 'console'], level: 'info' }
    }
});

const logger = log4js.getLogger();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/warehouse', require('./routes'));

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'blockchain-erp-backend'
    });
});

// Global error handler
app.use((err, req, res, next) => {
    logger.error('Unhandled error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Not found',
        message: `Route ${req.originalUrl} not found`
    });
});

app.listen(PORT, () => {
    logger.info(`ERP backend running on port ${PORT}`);
    logger.info(`Health check available at http://localhost:${PORT}/health`);
});

module.exports = app;