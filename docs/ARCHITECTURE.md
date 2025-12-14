# BlockchainDT Architecture

## System Overview

BlockchainDT implements a four-layer microservices architecture enabling modular research on distributed consensus mechanisms.

```
┌──────────────────────────────────────────────────────────────────┐
│                      RESEARCHER / USER                           │
│                    (REST API Client)                             │
└────────────────────────┬─────────────────────────────────────────┘
                         │ HTTP Requests
                         ▼
┌──────────────────────────────────────────────────────────────────┐
│               COORDINATION LAYER (Node.js)                       │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ routes.js - REST API Endpoints                            │ │
│  │  • POST /measurements   (record item dimensions)          │ │
│  │  • POST /predictions    (get ML weight prediction)        │ │
│  │  • GET /analytics       (retrieve KPIs)                   │ │
│  └─────────┬──────────────────────────┬──────────────────────┘ │
│            │                          │                         │
└────────────┼──────────────────────────┼─────────────────────────┘
             │                          │
             ▼                          ▼
┌─────────────────────────────┐ ┌──────────────────────────────┐
│   CONSENSUS LAYER (Go)      │ │  PREDICTION LAYER (Python)   │
│                             │ │                              │
│ ┌──────────────────────────┐│ │ ┌───────────────────────────┐│
│ │ contract.go              ││ │ │ model.py                  ││
│ │ Hyperledger Fabric       ││ │ │ XGBoost Predictor         ││
│ │ Chaincode                ││ │ │                           ││
│ │  • RecordMeasurement()   ││ │ │  predict_weight(features) ││
│ │  • CreateTariff()        ││ │ │  • Load model.json        ││
│ │  • CreateDispute()       ││ │ │  • Return prediction      ││
│ └───────┬──────────────────┘│ │ └────────┬──────────────────┘│
│         │                   │ │          │                   │
│         ▼                   │ │          ▼                   │
│  ┌────────────────┐         │ │   ┌──────────────┐          │
│  │ Blockchain     │         │ │   │ dw_model.json│          │
│  │ Ledger (PBFT)  │         │ │   │ (XGBoost)    │          │
│  │ Immutable State│         │ │   └──────────────┘          │
│  └────────────────┘         │ │                             │
└─────────────────────────────┘ └──────────────────────────────┘
             │
             │ KPI Data
             ▼
┌──────────────────────────────────────────────────────────────────┐
│            ANALYTICS LAYER (Python)                              │
│                                                                  │
│  ┌────────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │ demo_scenarios.py  │→ │ results_kpi.csv │→ │ plot_kpis.py │ │
│  │ Run benchmarks     │  │ Raw metrics     │  │ Generate plots│ │
│  └────────────────────┘  └─────────────────┘  └──────────────┘ │
│                                                                  │
│  Output: Latency, Throughput, MAE, Dispute Rate, Cost           │
└──────────────────────────────────────────────────────────────────┘
```

## Component Interactions

### 1. Measurement Recording Flow

```
User → POST /measurements
  ├→ routes.js validates input (length, width, height, weight)
  ├→ mlService.predictWeight([L, W, H, DF])
  │   └→ optimization/model.py loads XGBoost model
  │       └→ Returns predicted weight
  ├→ fabricService.recordMeasurement(id, L, W, H, predicted_weight)
  │   └→ contract.go RecordMeasurement()
  │       ├→ Validates measurement
  │       ├→ Stores in blockchain ledger (PBFT consensus)
  │       └→ Returns transaction ID
  └→ Response: {success, itemId, predictedWeight, txId}
```

### 2. Benchmark Scenario Flow

```
Researcher → npm run demo
  ├→ demo_scenarios.py loads synthetic_data.csv
  ├→ For each scenario (baseline_a, baseline_b, proposed):
  │   ├→ Run 1000 iterations with seed=42
  │   ├→ For each item:
  │   │   ├→ Get ML prediction
  │   │   ├→ Simulate consensus latency
  │   │   ├→ Calculate MAE, cost, dispute rate
  │   │   └→ Append to results[]
  │   └→ Save to results_kpi.csv
  ├→ Generate summary_results.csv
  └→ plot_kpis.py creates visualizations
      └→ Output: comparison plots (latency, throughput, accuracy)
```

## Layer Responsibilities

### Coordination Layer (Node.js + Express)

**File**: `erp-prototype/backend/routes.js` (563 lines)

**Purpose**: Multi-agent REST API orchestration

**Capabilities**:
- 14 REST endpoints for measurements, tariffs, disputes, analytics
- Service abstraction (fabricService, mlService)
- Input validation and error handling
- Request logging and instrumentation

**Key Functions**:
- `POST /api/warehouse/measurements` - Record item with ML prediction
- `POST /api/warehouse/tariffs` - Create tariff policy
- `POST /api/warehouse/disputes` - Create dispute
- `GET /api/warehouse/kpis` - Retrieve KPIs

**Extension Points**:
- Swap fabricService implementation (Fabric → Tendermint, Raft)
- Add custom endpoints for new research scenarios
- Inject fault injection middleware

### Consensus Layer (Hyperledger Fabric + Go)

**File**: `erp-prototype/chaincode/contract.go` (342 lines)

**Purpose**: Distributed ledger with Byzantine consensus

**Capabilities**:
- PBFT-style consensus (Hyperledger Fabric ordering service)
- Immutable state storage
- Smart contract validation logic
- Multi-organization support

**Key Functions**:
- `RecordMeasurement()` - Store measurement on blockchain
- `CreateTariff()` - Store tariff policy
- `CreateDispute()` - Store dispute with provenance
- `QueryByID()` - Retrieve state from ledger

**Consensus Protocol**:
- **Production**: PBFT via Fabric Orderer (f < n/3 tolerance)
- **Stub Mode**: Deterministic in-memory simulation

**Extension Points**:
- Implement custom consensus (Raft, Tendermint)
- Add Byzantine detection logic
- Modify validation rules

### Prediction Layer (Python + XGBoost)

**File**: `erp-prototype/optimization/model.py`

**Purpose**: ML-based state prediction

**Capabilities**:
- XGBoost gradient boosting regression
- Deterministic training (fixed seeds)
- Model versioning (dw_model.json)
- Fast test mode (analytical fallback)

**Key Functions**:
- `predict_weight(features)` - Predict dimensional weight
- `train_model(data)` - Train XGBoost with hyperparameters
- Model loading from `optimization/dw_model.json`

**Input**: `[length, width, height, density_factor]`
**Output**: Predicted weight (grams)

**Extension Points**:
- Swap XGBoost with neural network, GP, ensemble
- Add multi-party training (federated learning)
- Implement Byzantine-robust aggregation

### Analytics Layer (Python + Matplotlib)

**Files**:
- `erp-prototype/demo/demo_scenarios.py` (172 lines)
- `erp-prototype/demo/plot_kpis.py`

**Purpose**: Reproducible benchmarking and visualization

**Capabilities**:
- Seeded scenario generation (deterministic)
- KPI computation (latency, throughput, MAE, dispute rate)
- Publication-quality plots
- Statistical analysis

**Scenarios**:
- `baseline_a`: No consensus (eventually consistent)
- `baseline_b`: Centralized coordination
- `proposed`: PBFT consensus

**Outputs**:
- `demo/results_kpi.csv` - Raw metrics (3000 rows)
- `demo/summary_results.csv` - Aggregated statistics
- `demo/*.png` - Comparison plots

**Extension Points**:
- Add new scenarios (Raft, Byzantine attacks)
- Implement custom metrics (fairness, trust entropy)
- Generate statistical significance tests

## Data Flow

### Measurement Data Schema

```
Measurement {
  id: string              // Unique item identifier
  length: float           // cm
  width: float            // cm
  height: float           // cm
  weight: float           // grams (actual or predicted)
  organizationId: string  // Multi-party identifier
  timestamp: ISO8601      // Blockchain timestamp
  transactionId: string   // Blockchain tx hash
}
```

### KPI Data Schema

```
KPI Record {
  scenario: string        // baseline_a | baseline_b | proposed
  latency: float          // Consensus latency (seconds)
  throughput: float       // Transactions per second
  mae: float              // Mean Absolute Error (kg)
  cost_per_item: float    // USD
  dispute_rate: float     // Percentage (0-1)
  recovery_min: float     // Minutes to resolve dispute
}
```

## Deployment Modes

### Development Mode (Stub)

```bash
# Start with in-memory blockchain stub
export FABRIC_STUB_MODE=true
npm start
```

**Characteristics**:
- Fast (no network overhead)
- Deterministic (in-memory state)
- Single-machine execution
- Ideal for unit testing and demos

### Production Mode (Fabric)

```bash
# Deploy to real Hyperledger Fabric network
# Requires: Fabric network with peers, orderers, CAs
./deploy-chaincode.sh
npm start
```

**Characteristics**:
- Byzantine fault tolerance (f < n/3)
- Multi-organization support
- Persistent ledger
- Production-grade consensus

## Performance Characteristics

Based on benchmarks (Intel i7-10700K, 16GB RAM, Ubuntu 22.04):

| Metric | Stub Mode | Fabric Mode |
|--------|-----------|-------------|
| **Consensus Latency** | 0.52s | 1.46s |
| **Throughput** | 120 tx/s | 58 tx/s |
| **ML Prediction** | 3ms | 12ms |
| **Memory Footprint** | 120MB | 450MB |

## Security Properties

### Blockchain Guarantees

1. **Immutability**: Measurements cannot be altered after consensus
2. **Provenance**: Full audit trail of all state changes
3. **Byzantine Tolerance**: Tolerates f < n/3 malicious validators (PBFT)
4. **Cryptographic Integrity**: State hashed and chained

### Attack Surface

**Mitigated**:
- Measurement tampering (blockchain immutability)
- Centralized failure (distributed consensus)
- Single point of compromise (multi-party validation)

**Future Work**:
- Byzantine ML predictions (ensemble validation)
- Sybil attacks (reputation systems)
- Network partitions (optimistic concurrency)

## Extensibility Guide

### Adding a New Consensus Protocol

1. **Implement adapter** in `backend/fabric-service.js`:
   ```javascript
   class RaftConsensusService {
     async recordMeasurement(id, ...) {
       // Raft leader election
       // Log replication
       // Commitment after majority ACK
     }
   }
   ```

2. **Update routes.js** to use new service:
   ```javascript
   const consensusService = process.env.CONSENSUS === 'raft'
     ? new RaftConsensusService()
     : new FabricService();
   ```

3. **Add benchmark scenario**:
   ```python
   # demo/demo_scenarios.py
   'raft': {
     'base_latency': 0.8,
     'byzantine_tolerance': 0.0  # Crash-only
   }
   ```

### Adding a New ML Model

1. **Implement predictor** in `optimization/`:
   ```python
   # optimization/neural_net.py
   def predict_weight_nn(features):
       model = load_model('nn_model.h5')
       return model.predict([features])[0]
   ```

2. **Update model.py** to support selection:
   ```python
   if MODEL_TYPE == 'xgboost':
       return predict_weight_xgboost(features)
   elif MODEL_TYPE == 'neural_net':
       return predict_weight_nn(features)
   ```

### Adding a New Research Metric

```python
# demo/demo_scenarios.py
def calculate_fairness_gini(predictions_per_org):
    """Measure fairness across organizations using Gini coefficient"""
    sorted_preds = np.sort(predictions_per_org)
    n = len(sorted_preds)
    index = np.arange(1, n+1)
    gini = (2 * np.sum(index * sorted_preds)) / (n * np.sum(sorted_preds)) - (n + 1) / n
    return gini
```

## Testing Architecture

### Unit Tests (Jest)

**Coverage**: 100% statements, 85.7% branches

**Location**: `erp-prototype/tests/`

**Key Test Files**:
- `routes.test.js` - API endpoint tests
- `routes_error_paths.test.js` - Error handling
- `fabric_service.test.js` - Blockchain integration

**Run**: `npm test`

### Integration Tests

**Scenario**: End-to-end workflows

**Example**:
```javascript
test('Complete measurement workflow', async () => {
  const measurement = await POST('/measurements', itemData);
  expect(measurement.txId).toBeDefined();

  const retrieved = await GET(`/measurements/${itemData.id}`);
  expect(retrieved.weight).toBeCloseTo(measurement.predictedWeight);
});
```

### Reproducibility Tests (CI)

**GitHub Actions** job `determinism`:
- Run demo twice with same seed
- Verify byte-identical outputs
- Fails if non-deterministic

## Troubleshooting

### Common Issues

**Issue**: `npm test` fails with coverage errors
**Solution**: Check jest.config.js thresholds (100% statements, 85% branches)

**Issue**: ML predictions inconsistent
**Solution**: Ensure fixed seed in `train.py` and deterministic XGBoost settings

**Issue**: Blockchain stub slow
**Solution**: Reduce simulated latency in `fabric-service.js` (line 30)

**Issue**: Demo scenarios produce different outputs
**Solution**: Verify `--seed 42` flag and no time.time() calls

## Further Reading

- [Hyperledger Fabric Documentation](https://hyperledger-fabric.readthedocs.io/)
- [XGBoost Documentation](https://xgboost.readthedocs.io/)
- [PBFT Paper (Castro & Liskov 1999)](https://pmg.csail.mit.edu/papers/osdi99.pdf)
- [Raft Consensus](https://raft.github.io/)
- [Digital Twins (Grieves & Vickers 2014)](https://doi.org/10.1007/978-3-319-38756-7_4)

## Contact

For architecture questions or contributions:

**Almas Ospanov**
School of Software Engineering, Astana IT University
ospanov@astanait.edu.kz

**Repository**: [https://github.com/TerexSpace/BEBI-system-for-Warehouse](https://github.com/TerexSpace/BEBI-system-for-Warehouse)
