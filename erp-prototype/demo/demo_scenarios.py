import pandas as pd
import numpy as np
import time
import random
import sys
import os

# Add the parent directory to the Python path so we can import optimization modules
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
sys.path.append(parent_dir)

try:
    from optimization.model import predict_weight
except ImportError:
    # Fallback for direct execution
    sys.path.append(current_dir)
    from optimization.model import predict_weight

def run_scenario(scenario_name, df, num_iterations=100):
    """Run a demo scenario and collect KPIs"""
    results = []

    for i, row in df.iterrows():
        if i >= num_iterations:  # Limit iterations for demo
            break

        features = [row['L'], row['W'], row['H'], row['DF']]
        actual_weight = row['optimal_weight']

        # Simulate blockchain latency
        start_time = time.time()
        predicted_weight = predict_weight(features)
        end_time = time.time()

        latency = (end_time - start_time) * 1000  # Convert to milliseconds

        # Calculate accuracy metrics
        mae = abs(predicted_weight - actual_weight)

        # Simulate cost per transaction
        cost_per_item = 0.002 + random.uniform(0, 0.001)  # Base cost + variability

        # Simulate dispute rate (lower is better)
        dispute_rate = 0.023 + random.uniform(-0.01, 0.01)  # Base rate + variability

        # Simulate recovery time (minutes)
        recovery_min = 3.5 + random.uniform(-1, 1)

        results.append({
            'scenario': scenario_name,
            'latency': latency,
            'throughput': 120 + random.uniform(-20, 20),  # Items per minute
            'mae': mae,
            'cost_per_item': cost_per_item,
            'dispute_rate': dispute_rate,
            'recovery_min': recovery_min
        })

    return results

def main():
    """Run all demo scenarios"""
    df = pd.read_csv("demo/synthetic_data.csv")

    scenarios = ['baseline_a', 'baseline_b', 'proposed']

    all_results = []

    for scenario in scenarios:
        print(f"Running scenario: {scenario}")
        results = run_scenario(scenario, df)
        all_results.extend(results)

        # Print summary for this scenario
        scenario_results = [r for r in all_results if r['scenario'] == scenario]
        avg_latency = np.mean([r['latency'] for r in scenario_results])
        avg_throughput = np.mean([r['throughput'] for r in scenario_results])
        avg_mae = np.mean([r['mae'] for r in scenario_results])
        avg_cost = np.mean([r['cost_per_item'] for r in scenario_results])
        avg_dispute = np.mean([r['dispute_rate'] for r in scenario_results])
        avg_recovery = np.mean([r['recovery_min'] for r in scenario_results])

        print(f"  Avg Latency: {avg_latency:.2f}ms")
        print(f"  Avg Throughput: {avg_throughput:.1f} items/min")
        print(f"  Avg MAE: {avg_mae:.2f}")
        print(f"  Avg Cost: ${avg_cost:.4f}")
        print(f"  Avg Dispute Rate: {avg_dispute:.2f}")
        print(f"  Avg Recovery: {avg_recovery:.1f}min")
        print()

    # Save results to CSV
    results_df = pd.DataFrame(all_results)
    results_df.to_csv("demo/results_kpi.csv", index=False)
    print("Results saved to demo/results_kpi.csv")

    # Generate summary statistics
    summary = []
    for scenario in scenarios:
        scenario_data = results_df[results_df['scenario'] == scenario]
        summary.append({
            'scenario': scenario,
            'latency_mean': scenario_data['latency'].mean(),
            'latency_sd': scenario_data['latency'].std(),
            'throughput_mean': scenario_data['throughput'].mean(),
            'mae_mean': scenario_data['mae'].mean(),
            'cost_item': scenario_data['cost_per_item'].mean(),
            'dispute_rate': scenario_data['dispute_rate'].mean(),
            'recovery_min': scenario_data['recovery_min'].mean()
        })

    summary_df = pd.DataFrame(summary)
    summary_df.to_csv("demo/summary_results.csv", index=False)
    print("Summary saved to demo/summary_results.csv")

if __name__ == "__main__":
    main()