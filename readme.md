# DIM-Weight-ERP: Blockchain-Governed Digital Twin for Warehouse Management

[![CI](https://github.com/yourusername/dim-weight-erp/workflows/CI/badge.svg)](https://github.com/yourusername/dim-weight-erp/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.XXXXXXX.svg)](https://doi.org/10.5281/zenodo.XXXXXXX)

An open-source full-stack prototype for blockchain-governed dimensional weight prediction, tariff management, and dispute resolution in warehouse ERP systems.

## Overview

DIM-Weight-ERP integrates machine learning-based dimensional weight prediction with blockchain-backed provenance tracking and dispute resolution workflows. It provides researchers with a complete, reproducible platform for studying blockchain governance in supply chain operations, warehouse optimization, and trustworthy measurement enforcement.

### Key Features

- **Dimensional Weight Prediction**: XGBoost-based ML model trained on reproducible synthetic data
- **Tariff Management**: Pluggable policies with full audit trails via Hyperledger Fabric
- **Dispute Workflows**: Complete dispute lifecycle management with blockchain provenance
- **REST API**: Full-featured Node.js/Express API for all operations
- **Reproducibility**: Deterministic data generation, model training, and KPI computation
- **Production-Ready**: Docker containerization and Hyperledger Fabric smart contracts

## Installation

### Requirements

- Node.js 18+ and npm
- Python 3.9+
- Docker and Docker Compose (optional, for containerized deployment)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/dim-weight-erp.git
cd dim-weight-erp

# Install dependencies
npm run setup

# Run tests
npm test

# Start the backend API
npm start

# In another terminal, train the ML model
npm run train-model

# Run demo scenarios
npm run demo
```

### Using Docker

```bash
docker-compose up
```

The API will be available at `http://localhost:3000`.

## Usage

### REST API Endpoints

#### Measurements

- `POST /api/warehouse/measurements` - Record item measurement
- `GET /api/warehouse/measurements/:id` - Retrieve measurement
- `POST /api/warehouse/measurements/predict` - Predict dimensional weight

#### Tariffs

- `POST /api/warehouse/tariffs` - Create tariff policy
- `GET /api/warehouse/tariffs/:id` - Retrieve tariff policy
- `POST /api/warehouse/tariffs/calculate` - Calculate tariff for item

#### Disputes

- `POST /api/warehouse/disputes` - Create dispute
- `GET /api/warehouse/disputes/:id` - Retrieve dispute
- `PUT /api/warehouse/disputes/:id/status` - Update dispute status
- `GET /api/warehouse/disputes` - List all disputes

#### Analytics

- `POST /api/warehouse/plots/generate` - Generate KPI plots
- `GET /api/warehouse/health` - Health check

### Example: Creating a Tariff Policy

```bash
curl -X POST http://localhost:3000/api/warehouse/tariffs \
  -H "Content-Type: application/json" \
  -d '{
    "id": "weight_tariff_1",
    "name": "Weight-Based Shipping",
    "description": "Tariff based on item weight",
    "rate": 0.15,
    "unit": "weight",
    "category": "shipping",
    "createdBy": "admin"
  }'
```

### Example: Recording a Measurement

```bash
curl -X POST http://localhost:3000/api/warehouse/measurements \
  -H "Content-Type: application/json" \
  -d '{
    "id": "item_001",
    "length": 15.5,
    "width": 8.2,
    "height": 12.1,
    "actualWeight": 4.5,
    "organizationId": "org1"
  }'
```

## Architecture

### System Components

#### Backend API (Node.js/Express)

Provides a complete REST API for warehouse operations, including endpoints for recording item measurements, predicting dimensional weight, managing tariff policies, calculating tariffs, creating and tracking disputes, and generating KPIs and plots. The backend includes a Fabric service adapter for blockchain integration and an ML service wrapper for calling the Python XGBoost model.

#### Blockchain Layer (Hyperledger Fabric/Go)

Implements ledger-side data structures and transaction logic for recording item measurements with immutable timestamps, storing tariff policies, creating disputes with full lifecycle tracking, and maintaining transaction history. The chaincode is production-ready and can be deployed to real Fabric networks; a development stub is also provided for rapid prototyping.

#### Machine Learning (Python/XGBoost)

Handles dimensional weight prediction using supervised learning. The pipeline includes synthetic data generation, XGBoost model training with configurable hyperparameters, model persistence, and prediction APIs callable from the Node.js backend.

#### Analytics (Python/Matplotlib)

Computes and visualizes key performance indicators including latency, throughput, tariff accuracy, dispute rates, and cost-effectiveness. Scripts generate publication-ready plots and CSV files with detailed results.

## Testing

The codebase includes comprehensive automated tests:

```bash
# Run all tests with coverage
npm test

# Run Jest tests only
npm test -- --testPathPattern=tests/

# Run tests in watch mode
npm test -- --watch
```

### Test Coverage

- Node.js API: 100% statement coverage, 85.7% branch coverage
- Test Suite: 5 files, 37 test cases
- All tests are deterministic and reproducible

A GitHub Actions CI/CD pipeline automatically runs the full test suite on every push to ensure code quality and prevent regressions.

## Configuration

### Environment Variables

Create a `.env` file in the project root:

```bash
NODE_ENV=development
PORT=3000
LOG_LEVEL=info
FABRIC_STUB_MODE=true
PYTHON_PATH=python
```

### ML Model Configuration

Edit `erp-prototype/optimization/train.py` to customize:

- XGBoost hyperparameters
- Training data size and distribution
- Model persistence format

### Blockchain Configuration

For Hyperledger Fabric deployment, update `erp-prototype/chaincode/contract.go` and follow Fabric documentation for network setup.

## Documentation

- [API Documentation](./docs/API.md) - Full REST API specification
- [Architecture Guide](./docs/ARCHITECTURE.md) - System design and components
- [Deployment Guide](./docs/DEPLOYMENT.md) - Production deployment instructions
- [Data Format Specification](./docs/DATA_FORMAT.md) - Input/output data schemas

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on reporting bugs, proposing features, submitting pull requests, and code style standards.

## License

This project is licensed under the MIT License - see [LICENSE](LICENSE) for details.

## Citation

If you use DIM-Weight-ERP in your research, please cite our paper:

```bibtex
@article{Ospanov2025,
  title={DIM-Weight-ERP: An Open-Source Blockchain-Governed Digital Twin for Warehouse Management and ERP Integration},
  author={Ospanov, Almas and Alonso, Pedro J. and Zhumadillayeva, Ainur},
  journal={Journal of Open Source Software},
  year={2025},
  doi={10.21105/joss.XXXXX}
}
```

## Acknowledgments

We acknowledge the Hyperledger Fabric project, XGBoost development team, and the broader open-source community. Special thanks to contributors and reviewers who provided valuable feedback during development.

## Disclaimer

This software is provided as-is for research and educational purposes. While it implements production-ready components, thorough testing and security audits are recommended before deployment in production environments.
# DIM-Weight-ERP
