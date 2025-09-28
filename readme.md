# Blockchain-ERP Warehouse Prototype

## Setup

1. Launch local Hyperledger Fabric devnet.
2. Deploy chaincode from `chaincode/contract.go`.
3. Start backend: `node backend/app.js`.
4. Train optimization model: `python optimization/train.py`.
5. Run demo: `python demo/demo_scenarios.py`.

## KPIs

- Latency
- Accuracy
- Cost per shipment
- Dispute rate

## For prototype

- npm install then node backend/app.js.
- Ensure Fabric devnet scripts or stub; if not available, run chaincode stub (Go file compiles but requires Fabric network).
- pip install -r requirements.txt; run python optimization/train.py then python demo/demo_scenarios.py.
- Place CSVs into repo/demo/ and reference as needed for external plotting or keep pgfplots with embedded coordinates.
- Verify KPIs in repo/demo/results_kpi.csv and compile plots via LaTeX pgfplots.

## Structure

- StructureP bridge (REST endpoints).
  - chaincode/: Hyperledger Fabric smart contract (Go).
  - optimization/: Python ML model (XGBoost) for DW optimization.
  - demo/: Synthetic dataset, scenario runner, KPI results.
  - tests/: Unit tests for chaincode/backend.

## How to Reproduce

- Blockchain network: Launch Fabric devnet (or stub).
- Deploy chaincode: go run contract.go.
- Backend: npm install && node backend/app.js.
- Optimization: pip install -r requirements.txt && python optimization/train.py.
- Demo: python demo/demo_scenarios.py → generates results_kpi.csv.
- LaTeX: Compile main.tex with figures/tables included.

## Generate the diagramss (plots)

1) Run: npm run demo
2) Then call: GET <http://localhost:3000/api/warehouse/plots/generate>
View the images:
Overview
<http://localhost:3000/api/warehouse/plots/throughput_vs_latency.png>
<http://localhost:3000/api/warehouse/plots/cost_vs_txrate.png>
6.3 Qualitative Analysis
<http://localhost:3000/api/warehouse/plots/qualitative_latency_vs_tx.png>
<http://localhost:3000/api/warehouse/plots/qualitative_dispute_vs_tx.png>
6.4 Sensitivity Analysis
<http://localhost:3000/api/warehouse/plots/sensitivity_latency_vs_block_interval.png>
<http://localhost:3000/api/warehouse/plots/sensitivity_cost_vs_txrate.png>
Note: Restart the backend if routes were updated.
