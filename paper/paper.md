---
title: "BlockchainDT: A Framework for Investigating Distributed Consensus in Physical-Digital State Synchronization"
tags:
  - distributed systems
  - blockchain consensus
  - digital twin
  - state synchronization
  - Byzantine fault tolerance
  - machine learning
  - reproducible research
authors:
  - name: Almas Ospanov
    orcid: 0009-0004-3834-130X
    affiliation: 1
    corresponding: true
affiliations:
  - name: School of Software Engineering, Astana IT University
    index: 1
date: 2025-12-14
bibliography: paper.bib
repository: https://github.com/TerexSpace/BEBI-system-for-Warehouse.git
archive_doi: 10.5281/zenodo.17738530
---

## Summary

**BlockchainDT** is an open-source research framework for investigating distributed consensus mechanisms in physical-digital state synchronization systems. The framework implements a complete digital twin architecture where multiple autonomous agents must reach consensus on the state of physical objects based on sensor measurements, predictions, and policy enforcement—all without centralized coordination.

The system combines permissioned blockchain consensus (Hyperledger Fabric), machine learning-based state prediction (XGBoost), and multi-agent coordination protocols to enable researchers to investigate fundamental questions in distributed systems: How do consensus algorithms perform when validating ML model predictions? What are the latency-accuracy trade-offs in blockchain-governed state machines? How can Byzantine fault tolerance be achieved in physical-digital synchronization scenarios?

BlockchainDT provides a concrete implementation domain—dimensional weight estimation and policy enforcement—to ground these abstract distributed systems challenges in a realistic multi-party coordination scenario. The framework includes synthetic data generation with configurable distributions, deterministic benchmarking scenarios with seeded randomness, comprehensive instrumentation for measuring consensus latency and throughput, and modular architecture enabling researchers to swap consensus protocols, prediction models, and coordination policies.

## Statement of Need

Digital twin systems that synchronize physical and digital state across distributed, mutually distrusting parties face fundamental challenges in consensus, fault tolerance, and state validation [@Grieves2014; @Tao2018]. While blockchain consensus mechanisms like PBFT [@Castro1999] and Raft [@Ongaro2014] are well-studied for financial transactions, their application to physical-digital state synchronization—where state updates derive from sensor measurements and ML predictions rather than simple value transfers—remains underexplored.

Existing research frameworks focus on either: (1) blockchain consensus in isolation, without physical-world grounding [@Androulaki2018]; (2) digital twin systems with centralized coordination [@Glaessgen2012]; or (3) distributed machine learning without Byzantine fault tolerance [@Dean2012]. **No open-source framework integrates these three components** to enable investigation of consensus-driven physical-digital synchronization.

BlockchainDT addresses this gap by providing researchers with:

1. **Consensus Protocol Investigation**: Compare PBFT-style permissioned consensus with alternative approaches for validating state updates derived from ML predictions and sensor fusion
2. **Latency-Accuracy Trade-offs**: Measure how consensus overhead affects real-time state synchronization in scenarios requiring sub-second response times
3. **Byzantine Fault Tolerance in ML Validation**: Investigate how blockchain consensus can validate ML model outputs when multiple parties may submit conflicting predictions
4. **Reproducible Benchmarking**: Deterministic synthetic data generation and seeded simulation scenarios enable apples-to-apples comparison of different consensus protocols and validation strategies

### Target Research Domains

BlockchainDT enables research in:

- **Distributed Systems**: Consensus protocols for non-financial state machines, Byzantine agreement with ML-predicted state transitions
- **Digital Twin Systems**: Multi-party synchronization without centralized authority, blockchain-backed provenance for physical-digital state
- **Trustworthy ML**: Consensus-based validation of ML predictions in multi-stakeholder environments, adversarial robustness through distributed verification
- **Cyber-Physical Systems**: Real-time constraints in blockchain consensus, latency-throughput optimization for sensor-based state updates

### Related Research Software

Several tools address adjacent problems:

- **SimPy** [@SimPy2023]: Discrete-event simulation but no blockchain consensus
- **Hyperledger Caliper** [@Hyperledger2023]: Blockchain benchmarking without physical-digital state synchronization
- **Unity ML-Agents** [@Juliani2018]: Multi-agent RL environments but centralized coordination
- **PBFT-Go** [@PBFT2023]: PBFT implementation without digital twin domain

**Gap**: No existing framework combines blockchain consensus, ML-based state prediction, and multi-party physical-digital synchronization in a reproducible research testbed.

## Software Architecture

BlockchainDT implements a modular microservices architecture enabling researchers to investigate different consensus mechanisms, prediction models, and coordination strategies:

### Consensus Layer (Hyperledger Fabric + Go)

Implements distributed ledger logic for state synchronization:

- **Immutable State Records**: All physical measurements, ML predictions, and policy decisions recorded with cryptographic timestamps
- **Smart Contract Validation**: Chaincode enforces state transition rules, validates predictions against thresholds, and manages multi-party disputes
- **Pluggable Consensus**: Framework supports PBFT-based ordering (default) with architecture enabling researchers to implement alternative protocols (Raft, PoW variants)
- **Production & Stub Modes**: Deploy to real Fabric networks or use deterministic stub for rapid prototyping

### Prediction Layer (Python + XGBoost)

ML-based state estimation with reproducible training:

- **Synthetic Data Generation**: Configurable distributions for generating realistic sensor measurements (1,000-10,000 samples)
- **Deterministic Training**: Fixed random seeds ensure reproducible model weights across experiments
- **Model Versioning**: Prediction models tagged with training hyperparameters and data distributions
- **Fast Test Mode**: Analytical fallback for unit testing without full ML inference

### Coordination Layer (Node.js + Express)

Multi-agent REST API for distributed state management:

- **State Update Endpoints**: Agents submit measurements, predictions, and policy decisions
- **Consensus Orchestration**: Coordinates blockchain transactions across multiple parties
- **Instrumentation**: Comprehensive logging of latency (consensus round-trip time), throughput (transactions/second), and accuracy (prediction error)
- **Policy Enforcement**: Pluggable rules for validating state transitions and resolving conflicts

### Analytics Layer (Python + Matplotlib)

Reproducible benchmarking and visualization:

- **Seeded Scenarios**: Three baseline scenarios (centralized, eventually-consistent, blockchain-consensus) with fixed random seeds
- **KPI Computation**: Automated calculation of latency, throughput, prediction MAE, dispute rates, and cost metrics
- **Publication Plots**: Publication-ready visualizations comparing consensus protocols

## Research Applications

### Investigating Consensus Overhead

Researchers can compare latency-throughput trade-offs:

```python
# Run baseline (no consensus), Raft, and PBFT scenarios
python demo/demo_scenarios.py --consensus-protocol pbft --iterations 10000
# Generate comparative plots: latency vs throughput, accuracy vs cost
python demo/plot_kpis.py
```

Expected research questions:
- How does PBFT consensus latency scale with validator count?
- What is the accuracy penalty of eventually-consistent (no blockchain) approaches?
- Can optimistic concurrency reduce consensus overhead for non-conflicting updates?

### Byzantine ML Validation

Investigate adversarial scenarios where malicious agents submit false predictions:

```python
# Inject Byzantine agents with corrupted predictions
python demo/byzantine_scenarios.py --byzantine-ratio 0.3 --attack-type random
# Measure consensus effectiveness at rejecting false state updates
```

Expected research questions:
- How many Byzantine validators can PBFT tolerate before state corruption?
- Can ML ensemble methods (stacking, voting) improve Byzantine resilience?
- What are detection latencies for subtle adversarial perturbations?

### Real-Time Digital Twin Synchronization

Measure real-time performance under high-frequency updates:

```bash
# Simulate 1000 concurrent state updates/second
node benchmarks/stress_test.js --rate 1000 --duration 60
```

Expected research questions:
- Can permissioned blockchains achieve sub-second finality for physical state updates?
- How do network partitions affect eventual consistency guarantees?
- What is the minimum viable blockchain architecture for real-time digital twins?

## Testing and Quality Assurance

- **Comprehensive Test Suite**: 37 Jest tests covering API endpoints, consensus integration, ML prediction, and error paths (100% statement coverage, 85.7% branch coverage)
- **Deterministic Scenarios**: All benchmarks use fixed random seeds (default: seed=42) for reproducibility
- **CI/CD Pipeline**: GitHub Actions runs full test suite + scenario benchmarks on every commit
- **Synthetic Data Validation**: Generated datasets validated against statistical properties (distribution moments, outlier rates)

## Implementation Notes

### Reproducibility Guarantees

All components designed for deterministic execution:

- Random seeds fixed in data generation, ML training, and scenario simulation
- Model hyperparameters version-controlled in `optimization/dw_model.json`
- Blockchain stub mode provides deterministic transaction ordering
- Docker containers pin dependency versions

### Extensibility for Researchers

Modular design enables swapping components:

- **Consensus Protocol**: Replace Fabric with Raft, Tendermint, or custom protocols via adapter pattern
- **Prediction Model**: Swap XGBoost with neural networks, GPs, or ensemble methods
- **Coordination Policy**: Implement custom state validation rules in chaincode
- **Benchmarking Scenarios**: Add new scenarios in `demo/` with different data distributions, attack models, or network topologies

### Performance Characteristics

Measured on 4-core Intel i7, 16GB RAM, Ubuntu 22.04:

- **Consensus Latency**: 1.47s mean (blockchain mode), 0.52s (stub mode)
- **Throughput**: 58 transactions/second (blockchain), 120 tx/s (stub)
- **Prediction Latency**: 12ms per item (XGBoost), 3ms (fast mode)
- **Memory Footprint**: 450MB (full stack), 120MB (stub only)

## Acknowledgements

We acknowledge the Hyperledger Fabric project, the XGBoost development community, the JOSS reviewers, and the open-source distributed systems research community. This research was conducted at the School of Software Engineering, Astana IT University.

## References
