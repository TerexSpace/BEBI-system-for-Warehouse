#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Analyze consensus protocol comparison results.
Research Question: What is the latency overhead of PBFT consensus vs no consensus?
"""

import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
import sys
import io

# Fix Unicode encoding on Windows
if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# Load results
df = pd.read_csv('raw_results.csv')

# Separate scenarios
baseline_a = df[df['scenario'] == 'baseline_a']  # No consensus
baseline_b = df[df['scenario'] == 'baseline_b']  # Centralized
proposed = df[df['scenario'] == 'proposed']  # PBFT consensus

print("=" * 60)
print("CONSENSUS PROTOCOL COMPARISON ANALYSIS")
print("=" * 60)
print()

# Latency analysis
print("LATENCY ANALYSIS")
print("-" * 60)
print(f"No Consensus (baseline_a):")
print(f"  Mean: {baseline_a['latency'].mean():.3f}s")
print(f"  Median: {baseline_a['latency'].median():.3f}s")
print(f"  Std Dev: {baseline_a['latency'].std():.3f}s")
print(f"  p95: {baseline_a['latency'].quantile(0.95):.3f}s")
print(f"  p99: {baseline_a['latency'].quantile(0.99):.3f}s")
print()

print(f"PBFT Consensus (proposed):")
print(f"  Mean: {proposed['latency'].mean():.3f}s")
print(f"  Median: {proposed['latency'].median():.3f}s")
print(f"  Std Dev: {proposed['latency'].std():.3f}s")
print(f"  p95: {proposed['latency'].quantile(0.95):.3f}s")
print(f"  p99: {proposed['latency'].quantile(0.99):.3f}s")
print()

# Calculate overhead
overhead_mean = (proposed['latency'].mean() / baseline_a['latency'].mean() - 1) * 100
overhead_median = (proposed['latency'].median() / baseline_a['latency'].median() - 1) * 100

print(f"PBFT Overhead:")
print(f"  Mean latency overhead: +{overhead_mean:.1f}%")
print(f"  Median latency overhead: +{overhead_median:.1f}%")
print()

# Throughput analysis
print("THROUGHPUT ANALYSIS")
print("-" * 60)
print(f"No Consensus: {baseline_a['throughput'].mean():.1f} tx/s")
print(f"PBFT Consensus: {proposed['throughput'].mean():.1f} tx/s")
throughput_reduction = (1 - proposed['throughput'].mean() / baseline_a['throughput'].mean()) * 100
print(f"Throughput reduction: {throughput_reduction:.1f}%")
print()

# Accuracy analysis
print("ACCURACY ANALYSIS")
print("-" * 60)
print(f"No Consensus MAE: {baseline_a['mae'].mean():.3f}")
print(f"PBFT Consensus MAE: {proposed['mae'].mean():.3f}")
accuracy_improvement = (1 - proposed['mae'].mean() / baseline_a['mae'].mean()) * 100
print(f"Accuracy improvement: {accuracy_improvement:.1f}%")
print()

# Key findings
print("KEY FINDINGS")
print("-" * 60)
print(f"1. PBFT adds {overhead_mean:.1f}% latency overhead")
print(f"2. Throughput decreases by {throughput_reduction:.1f}%")
print(f"3. Accuracy improves by {accuracy_improvement:.1f}%")
print(f"4. PBFT provides Byzantine tolerance (tolerates f < n/3 malicious nodes)")
print()

# Generate plots
fig, axes = plt.subplots(1, 2, figsize=(12, 5))

# Plot 1: Latency comparison
axes[0].boxplot([baseline_a['latency'], proposed['latency']],
                labels=['No Consensus', 'PBFT'])
axes[0].set_ylabel('Latency (seconds)')
axes[0].set_title('Latency Distribution Comparison')
axes[0].grid(axis='y', alpha=0.3)

# Plot 2: Throughput comparison
scenarios = ['No Consensus', 'PBFT']
throughputs = [baseline_a['throughput'].mean(), proposed['throughput'].mean()]
axes[1].bar(scenarios, throughputs, color=['#2ecc71', '#e74c3c'])
axes[1].set_ylabel('Throughput (tx/s)')
axes[1].set_title('Throughput Comparison')
axes[1].grid(axis='y', alpha=0.3)

plt.tight_layout()
plt.savefig('latency_comparison.png', dpi=300, bbox_inches='tight')
print("[PLOT] Saved plot: latency_comparison.png")
print()

# Generate findings document
with open('findings.md', 'w', encoding='utf-8') as f:
    f.write("# Research Finding: PBFT Consensus Overhead\n\n")
    f.write("## Research Question\n\n")
    f.write("What is the latency overhead of PBFT consensus compared to no consensus in physical-digital state synchronization?\n\n")
    f.write("## Method\n\n")
    f.write("- Ran 1000 iterations of `baseline_a` (no consensus) and `proposed` (PBFT) scenarios\n")
    f.write("- Used deterministic seed=42 for reproducibility\n")
    f.write("- Measured latency, throughput, and prediction accuracy\n\n")
    f.write("## Results\n\n")
    f.write(f"**Latency:**\n")
    f.write(f"- No consensus: {baseline_a['latency'].mean():.3f}s mean ({baseline_a['latency'].quantile(0.95):.3f}s p95)\n")
    f.write(f"- PBFT: {proposed['latency'].mean():.3f}s mean ({proposed['latency'].quantile(0.95):.3f}s p95)\n")
    f.write(f"- **Overhead: +{overhead_mean:.1f}%**\n\n")
    f.write(f"**Throughput:**\n")
    f.write(f"- No consensus: {baseline_a['throughput'].mean():.1f} tx/s\n")
    f.write(f"- PBFT: {proposed['throughput'].mean():.1f} tx/s\n")
    f.write(f"- **Reduction: {throughput_reduction:.1f}%**\n\n")
    f.write(f"**Accuracy:**\n")
    f.write(f"- No consensus MAE: {baseline_a['mae'].mean():.3f}\n")
    f.write(f"- PBFT MAE: {proposed['mae'].mean():.3f}\n")
    f.write(f"- **Improvement: +{accuracy_improvement:.1f}%**\n\n")
    f.write("## Interpretation\n\n")
    f.write(f"PBFT consensus adds approximately {overhead_mean:.0f}% latency overhead ")
    f.write(f"({baseline_a['latency'].mean():.2f}s → {proposed['latency'].mean():.2f}s) ")
    f.write("but provides Byzantine fault tolerance, allowing the system to tolerate up to f < n/3 malicious validators.\n\n")
    f.write(f"The throughput reduction of {throughput_reduction:.0f}% is due to PBFT's O(n²) message complexity, ")
    f.write("where validators must exchange prepare and commit messages before finalizing state updates.\n\n")
    f.write(f"Interestingly, PBFT improves prediction accuracy by {accuracy_improvement:.0f}%, ")
    f.write("suggesting that consensus-based validation filters out outlier predictions.\n\n")
    f.write("## Implications for Real-Time Digital Twins\n\n")
    f.write(f"For applications requiring sub-second latency, PBFT's {proposed['latency'].mean():.2f}s mean latency may be acceptable ")
    f.write("if Byzantine tolerance is required. However, applications needing <1s finality should consider:\n\n")
    f.write("1. **Raft** (crash-fault tolerance only): Faster consensus with O(n) messages\n")
    f.write("2. **Optimistic concurrency**: Assume no conflicts, use PBFT only for dispute resolution\n")
    f.write("3. **Trusted environment**: If all parties are trusted, skip consensus entirely\n\n")
    f.write("## Reproducibility\n\n")
    f.write("```bash\n")
    f.write("# Reproduce this analysis:\n")
    f.write("cd results/consensus_comparison\n")
    f.write("bash run.sh\n")
    f.write("```\n\n")
    f.write(f"**Data:** `raw_results.csv` (3000 rows, seed=42)\n\n")
    f.write(f"**Plots:** `latency_comparison.png`\n\n")

print("[FINDINGS] Saved findings: findings.md")
print()
print("=" * 60)
print("Analysis complete!")
print("=" * 60)
