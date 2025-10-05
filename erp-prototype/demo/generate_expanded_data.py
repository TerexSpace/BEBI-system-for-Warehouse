import pandas as pd
import numpy as np
import random
import os

def generate_expanded_synthetic_data(num_records=1000):
    """
    Generate expanded synthetic data for warehouse items with realistic distributions
    """
    np.random.seed(42)  # For reproducible results
    random.seed(42)

    # Define realistic ranges for dimensions (in cm)
    length_range = (5, 50)    # Length: 5-50 cm
    width_range = (3, 30)     # Width: 3-30 cm
    height_range = (2, 40)    # Height: 2-40 cm
    density_factor_range = (0.7, 1.0)  # Density factor: 0.7-1.0

    # Generate correlated dimensions (realistic item shapes)
    data = []

    for i in range(num_records):
        # Generate base dimensions with some correlation
        base_size = np.random.uniform(5, 40)

        # Add some variation and ensure realistic proportions
        length = max(length_range[0], min(length_range[1],
                     base_size * np.random.uniform(0.8, 1.4)))
        width = max(width_range[0], min(width_range[1],
                    base_size * np.random.uniform(0.4, 1.2)))
        height = max(height_range[0], min(height_range[1],
                     base_size * np.random.uniform(0.3, 1.1)))

        # Ensure minimum size constraints
        length = max(length, 5)
        width = max(width, 3)
        height = max(height, 2)

        # Generate density factor with realistic distribution
        density_factor = np.random.uniform(density_factor_range[0], density_factor_range[1])

        # Calculate weight based on volume and density
        # Weight = Volume * Density_factor * Material_density (assuming avg 0.85 g/cm³)
        volume = (length * width * height) / 1000  # Convert to liters
        material_density = 0.85  # Average material density in g/cm³
        weight = volume * density_factor * material_density * 1000  # Convert to grams

        # Add some realistic variation to weight (±15%)
        weight_variation = np.random.uniform(0.85, 1.15)
        weight = weight * weight_variation

        # Ensure weight is reasonable (not too light or heavy for the size)
        min_weight = (length * width * height) / 2000  # Minimum reasonable weight
        max_weight = (length * width * height) / 500   # Maximum reasonable weight

        weight = max(min_weight, min(max_weight, weight))

        # Round to reasonable precision
        length = round(length, 1)
        width = round(width, 1)
        height = round(height, 1)
        density_factor = round(density_factor, 2)
        weight = round(weight, 1)

        data.append({
            'L': length,
            'W': width,
            'H': height,
            'DF': density_factor,
            'optimal_weight': weight
        })

    # Create DataFrame
    df = pd.DataFrame(data)

    # Add some outliers and edge cases for more realistic data
    # Add 5% outliers with extreme dimensions
    outlier_indices = random.sample(range(num_records), int(num_records * 0.05))

    for idx in outlier_indices:
        if random.choice([True, False]):
            # Very large item
            df.at[idx, 'L'] = round(np.random.uniform(60, 100), 1)
            df.at[idx, 'W'] = round(np.random.uniform(40, 80), 1)
            df.at[idx, 'H'] = round(np.random.uniform(50, 90), 1)
        else:
            # Very small item
            df.at[idx, 'L'] = round(np.random.uniform(1, 4), 1)
            df.at[idx, 'W'] = round(np.random.uniform(1, 3), 1)
            df.at[idx, 'H'] = round(np.random.uniform(1, 3), 1)

        # Recalculate weight for outlier
        volume = (df.at[idx, 'L'] * df.at[idx, 'W'] * df.at[idx, 'H']) / 1000
        material_density = 0.85
        new_weight = volume * df.at[idx, 'DF'] * material_density * 1000
        df.at[idx, 'optimal_weight'] = round(new_weight, 1)

    # Add some items with extreme density factors
    extreme_density_indices = random.sample(range(num_records), int(num_records * 0.03))

    for idx in extreme_density_indices:
        df.at[idx, 'DF'] = round(np.random.choice([0.5, 1.2]), 2)
        # Recalculate weight
        volume = (df.at[idx, 'L'] * df.at[idx, 'W'] * df.at[idx, 'H']) / 1000
        material_density = 0.85
        new_weight = volume * df.at[idx, 'DF'] * material_density * 1000
        df.at[idx, 'optimal_weight'] = round(new_weight, 1)

    # Shuffle the data to avoid any ordering patterns
    df = df.sample(frac=1, random_state=42).reset_index(drop=True)

    # Add sequential IDs for reference
    df.index.name = 'id'
    df = df.reset_index()

    return df

def main():
    """Generate expanded synthetic dataset"""
    print("Generating expanded synthetic dataset...")

    # Generate 1000 records
    df = generate_expanded_synthetic_data(1000)

    # Save to CSV
    output_path = "demo/synthetic_data_expanded.csv"
    df.to_csv(output_path, index=False)

    print(f"Generated {len(df)} records")
    print(f"Saved to {output_path}")

    # Print some statistics
    print("\nDataset Statistics:")
    print(f"Length range: {df['L'].min():.1f} - {df['L'].max():.1f} cm")
    print(f"Width range: {df['W'].min():.1f} - {df['W'].max():.1f} cm")
    print(f"Height range: {df['H'].min():.1f} - {df['H'].max():.1f} cm")
    print(f"Weight range: {df['optimal_weight'].min():.1f} - {df['optimal_weight'].max():.1f} g")
    print(f"Density factor range: {df['DF'].min():.2f} - {df['DF'].max():.2f}")

    # Update the original synthetic_data.csv file as well
    original_path = "demo/synthetic_data.csv"
    df.to_csv(original_path, index=False)
    print(f"Updated original file: {original_path}")

if __name__ == "__main__":
    main()
