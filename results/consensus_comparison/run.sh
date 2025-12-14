#!/bin/bash
# Research Case Study: Consensus Protocol Comparison
# Question: What is the latency overhead of PBFT consensus vs no consensus?

set -e

echo "=== Consensus Comparison Research Study ==="
echo "Running 1000 iterations with seed=42 for reproducibility..."
echo ""

cd ../../erp-prototype

# Run scenarios
python demo/demo_scenarios.py --seed 42 --limit 1000

# Copy results
cp demo/results_kpi.csv ../results/consensus_comparison/raw_results.csv
cp demo/summary_results.csv ../results/consensus_comparison/summary.csv

# Run analysis
cd ../results/consensus_comparison
python analyze.py

echo ""
echo "✅ Analysis complete! See findings.md for results."
echo "📊 Plots saved to latency_comparison.png and throughput_comparison.png"
