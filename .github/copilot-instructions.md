
# Copilot Instructions – Blockchain-ERP Warehouse Management


## System Architecture

Hybrid blockchain-ERP prototype for warehouse management with ML-based dimensional weight (DW) optimization. Three-tier architecture:

1. **Backend (Node.js)**: REST API (`erp-prototype/backend/app.js`, Express, port 3000)
2. **Blockchain Layer**: Hyperledger Fabric smart contract (`erp-prototype/chaincode/contract.go`) – **stubbed** via `fabric-service.js` for local/dev. Swap in real Fabric SDK for production.
3. **ML Service**: XGBoost model in `erp-prototype/optimization/` predicts optimal weight from dimensions (L, W, H, density factor). Node.js calls Python via child_process.


## Critical Developer Workflows

### Unified Setup
Use `start.sh` for a one-step setup (Node.js, Python, model training):
```bash
./start.sh
```
Manual steps:
```bash
npm install                      # Node.js deps
pip install -r requirements.txt  # Python deps
python erp-prototype/optimization/train.py  # Train XGBoost model
npm start                        # Start backend (port 3000)
```

### Development Commands
- `npm run dev` – Start with nodemon (auto-reload)
- `npm test` – Run Jest tests in `erp-prototype/tests/` (services must be initialized)
- `npm run demo` – Generate 3,000 KPI data points (KPI scenarios)
- `python erp-prototype/demo/generate_expanded_data.py` – Create 1,000 synthetic shipment records

### Generating Performance Plots
```bash
curl http://localhost:3000/api/warehouse/plots/generate
# View at: http://localhost:3000/api/warehouse/plots/throughput_vs_latency.png
```


## Key Conventions & Patterns

### Blockchain Integration (Stub/Real)
All blockchain ops go through `FabricService` (stubbed: simulates Fabric, mock tx IDs, network delay). To enable real Fabric:
- Replace stub logic in `fabric-service.js` with Fabric SDK calls
- Deploy `chaincode/contract.go` to Fabric network
- API layer in `routes.js` remains unchanged

Example:
```js
const result = await fabricService.recordMeasurement(id, length, width, height, weight, organizationId);
```

### ML Model Fallback & Auto-Training
`MLService` (`ml-service.js`) loads XGBoost model from `dw_model.json`. If missing, auto-trains from `synthetic_data.csv`. If training fails, falls back to: `volume * densityFactor * 0.001`.
**Note:** Model file is JSON (not pickle).

### Service Initialization
All routes use `checkServices` middleware (see `routes.js`, ~line 29): returns 503 if `fabricService` or `mlService` not ready. Add to new blockchain/ML endpoints.

### Node.js ↔ Python Execution
Python ML code is called from Node.js via `child_process.spawn` (see `MLService.callPythonModel()` in `ml-service.js`).
Model path: always resolve via `path.join(__dirname, '../optimization/dw_model.json')` (relative to backend).


## Domain-Specific Features & Extension Points

### Tariff & Dispute Management
See `routes.js` (lines 295+):
- `POST /api/warehouse/tariffs` – Create tariff policies (weight/volume/item-based)
- `POST /api/warehouse/tariffs/calculate` – Calculate tariffs for items (uses blockchain data)
- `POST /api/warehouse/disputes` – Create disputes (measurement/tariff/payment)
- `PUT /api/warehouse/disputes/:id/status` – Update dispute resolution
Extend logic in `routes.js` and smart contract (`contract.go`: `CreateTariffPolicy`, `CalculateTariff`, `CreateDispute`, `UpdateDisputeStatus`).

### KPI Generation
`demo_scenarios.py` runs 3 scenarios (baseline_a, baseline_b, proposed):
- Latency: baseline_a ~0.52s, baseline_b ~2.03s, proposed ~1.47s
- Dispute rate: baselines ~2.3%, proposed ~0.4%
- Outputs: `results_kpi.csv`, `summary_results.csv`, `synthesis_matrix.csv`


## Integration Points

### Data Flow: Item Recording
1. Client → `POST /api/warehouse/items` (dimensions)
2. `MLService.predictWeight([L, W, H, DF])` → Python `model.py`
3. `FabricService.recordMeasurement()` → blockchain (stubbed or real)
4. Returns: `{itemId, predictedWeight, blockchainResult, timestamp}`

### Cross-Service Dependencies
- `routes.js` imports both `FabricService` and `MLService`
- Python scripts import `optimization.model` for predictions
- `demo_scenarios.py` must run after `train.py` creates `dw_model.json`


## Testing Strategy

Tests in `erp-prototype/tests/` use Jest + Supertest:
- API endpoint tests (health, items CRUD, optimization)
- Service integration tests (FabricService, MLService initialization)
- **Backend must be running and services initialized** before running tests


## Project-Specific Quirks

1. **Port conflicts**: If 3000 busy: `taskkill /PID <PID> /F` (Windows) or kill process manually
2. **Model training failures**: System continues with volume-based fallback – check logs in `logs/app.log`
3. **Chaincode compilation**: `contract.go` compiles but requires Hyperledger Fabric network to deploy. Stub mode is default for dev.
4. **JOSS submission**: See `JOSS_SUBMISSION_INSTRUCTIONS.md`


## Logging Convention
Uses log4js (console + `logs/app.log`). Log levels:
- `logger.info()` – startup, successful ops
- `logger.error()` – failures (full error objects)
- `logger.warn()` – non-critical issues (e.g., missing model files)


## Key Files Reference
- `erp-prototype/backend/routes.js` – All API endpoints
- `erp-prototype/backend/fabric-service.js` – Blockchain stub/adapter
- `erp-prototype/backend/ml-service.js` – ML model interface
- `erp-prototype/chaincode/contract.go` – Smart contract
- `erp-prototype/optimization/train.py` – Model training (XGBoost)
- `erp-prototype/demo/demo_scenarios.py` – KPI simulation engine
- `start.sh` – Unified setup script
