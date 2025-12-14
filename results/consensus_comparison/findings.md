# Research Finding: PBFT Consensus Overhead

## Research Question

What is the latency overhead of PBFT consensus compared to no consensus in physical-digital state synchronization?

## Method

- Ran 1000 iterations of `baseline_a` (no consensus) and `proposed` (PBFT) scenarios
- Used deterministic seed=42 for reproducibility
- Measured latency, throughput, and prediction accuracy

## Results

**Latency:**
- No consensus: 0.522s mean (0.611s p95)
- PBFT: 1.464s mean (1.660s p95)
- **Overhead: +180.8%**

**Throughput:**
- No consensus: 119.9 tx/s
- PBFT: 58.3 tx/s
- **Reduction: 51.3%**

**Accuracy:**
- No consensus MAE: 2.116
- PBFT MAE: 0.762
- **Improvement: +64.0%**

## Interpretation

PBFT consensus adds approximately 181% latency overhead (0.52s → 1.46s) but provides Byzantine fault tolerance, allowing the system to tolerate up to f < n/3 malicious validators.

The throughput reduction of 51% is due to PBFT's O(n²) message complexity, where validators must exchange prepare and commit messages before finalizing state updates.

Interestingly, PBFT improves prediction accuracy by 64%, suggesting that consensus-based validation filters out outlier predictions.

## Implications for Real-Time Digital Twins

For applications requiring sub-second latency, PBFT's 1.46s mean latency may be acceptable if Byzantine tolerance is required. However, applications needing <1s finality should consider:

1. **Raft** (crash-fault tolerance only): Faster consensus with O(n) messages
2. **Optimistic concurrency**: Assume no conflicts, use PBFT only for dispute resolution
3. **Trusted environment**: If all parties are trusted, skip consensus entirely

## Reproducibility

```bash
# Reproduce this analysis:
cd results/consensus_comparison
bash run.sh
```

**Data:** `raw_results.csv` (3000 rows, seed=42)

**Plots:** `latency_comparison.png`

