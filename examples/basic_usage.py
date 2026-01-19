"""
Basic Usage Example for DEA Bounded Rationality Engine.

This example demonstrates how to evaluate a set of Decision Making Units (DMUs)
using Cross-Efficiency with Bounded Rationality.
"""
import numpy as np
import sys
import os

# Add src to path (not needed if package is installed)
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

from dea_br import BoundedRationalityEvaluator


def main():
    # 1. Define Your Data
    
    # Example: 5 sales representatives evaluated on their performance
    # Inputs (Resources Used):
    #   - Salary (thousands USD)
    #   - Training Hours
    # Outputs (Results Produced):
    #   - Total Sales (thousands USD)
    #   - Customer Satisfaction Score (0-100)
    
    dmu_ids = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve']
    
    inputs = np.array([
        [50, 20],   # Alice: $50k salary, 20 training hours
        [60, 40],   # Bob: $60k salary, 40 training hours
        [55, 30],   # Charlie
        [70, 50],   # Diana
        [45, 15],   # Eve
    ])
    
    outputs = np.array([
        [200, 85],  # Alice: $200k sales, 85 satisfaction
        [180, 75],  # Bob
        [220, 90],  # Charlie
        [250, 95],  # Diana
        [150, 70],  # Eve
    ])
    
    # 2. Set Objectives
    
    # Organizational Objective: The company's target efficiency level
    theta_oo = 0.8  # Expect everyone to be at least 80% efficient
    
    # Personal Objectives: Individual targets (can be based on history, role, etc.)
    personal_objectives = {
        'Alice': 0.85,
        'Bob': 0.75,
        'Charlie': 0.80,
        'Diana': 0.90,
        'Eve': 0.70,
    }
    
    # 3. Initialize Evaluator
    
    evaluator = BoundedRationalityEvaluator(
        theta_oo=theta_oo,
        mu=0.6,         # 60% weight on organizational objective
        alpha=0.88,     # Prospect Theory: Gain diminishing sensitivity
        beta=0.88,      # Prospect Theory: Loss diminishing sensitivity
        lambda_=2.25    # Prospect Theory: Loss aversion coefficient
    )
    
    # 4. Run Evaluation
    
    results = evaluator.evaluate(
        dmu_ids=dmu_ids,
        inputs=inputs,
        outputs=outputs,
        personal_objectives=personal_objectives
    )
    
    # 5. Display Results
    
    print("\n" + "="*70)
    print("DEA Bounded Rationality Evaluation Results")
    print("="*70)
    
    print(f"\nOrganizational Objective (theta_oo): {theta_oo}")
    print(f"Composite Weight (mu): 0.6 (60% Org / 40% Personal)")
    
    print("\n" + "-"*70)
    print(f"{'Name':<12} {'CCR Eff':<10} {'Cross Eff':<12} {'Rank':<6} {'Category':<15}")
    print("-"*70)
    
    # Sort by rank for display
    sorted_results = sorted(results.items(), key=lambda x: x[1]['rank'])
    
    for name, res in sorted_results:
        print(f"{name:<12} {res['ccr_efficiency']:.4f}     {res['cross_efficiency']:.4f}       "
              f"{res['rank']:<6} {res['category']:<15}")
    
    print("-"*70)
    print("\nInterpretation:")
    print("- CCR Efficiency: Self-evaluation score (1.0 = fully efficient frontier)")
    print("- Cross Efficiency: Peer-evaluated score considering bounded rationality")
    print("- Categories based on percentile ranking in the evaluated group")


if __name__ == "__main__":
    main()
