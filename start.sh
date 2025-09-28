#!/bin/bash

echo "🚀 Starting Blockchain-ERP Warehouse Management Prototype"
echo "========================================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js to continue."
    exit 1
fi

# Check if Python is installed
if ! command -v python &> /dev/null; then
    echo "❌ Python is not installed. Please install Python to continue."
    exit 1
fi

echo "✅ Dependencies check passed"

# Install Node.js dependencies
echo "📦 Installing Node.js dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install Node.js dependencies"
    exit 1
fi

# Install Python dependencies
echo "🐍 Installing Python dependencies..."
cd erp-prototype
pip install -r ../requirements.txt

if [ $? -ne 0 ]; then
    echo "❌ Failed to install Python dependencies"
    exit 1
fi

echo "✅ All dependencies installed successfully"

# Train the ML model
echo "🤖 Training ML model..."
python optimization/train.py

if [ $? -ne 0 ]; then
    echo "⚠️  Warning: ML model training failed, but continuing..."
fi

echo "✅ Setup completed"

echo ""
echo "🎯 To start the system:"
echo "   1. Start Fabric Network Stub: npm run fabric-stub"
echo "   2. In another terminal: Start Backend API: npm start"
echo "   3. Test the API: curl http://localhost:3000/health"
echo "   4. Run demo scenarios: npm run demo"
echo "   5. Run tests: npm test"
echo ""
echo "📚 API Documentation:"
echo "   - Health Check: GET http://localhost:3000/health"
echo "   - Record Item: POST http://localhost:3000/api/warehouse/items"
echo "   - Get Item: GET http://localhost:3000/api/warehouse/items/{id}"
echo "   - Analytics: GET http://localhost:3000/api/warehouse/analytics"
echo "   - Optimize: POST http://localhost:3000/api/warehouse/optimize"
echo ""
echo "🔧 Fabric Stub Endpoints (on port 7050):"
echo "   - Network Info: GET http://localhost:7050/network/info"
echo "   - Record Measurement: POST http://localhost:7050/chaincode/RecordMeasurement"
echo "   - Get Measurement: GET http://localhost:7050/chaincode/GetMeasurement/{id}"
echo ""
echo "Happy coding! 🎉"
