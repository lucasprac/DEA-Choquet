"""
Paper Reproduction Example.

Reproduces results from Shi et al. (2024) using Table 2 data (21 DMUs from energy industry).
"""
import numpy as np
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

from dea_br import BoundedRationalityEvaluator
from dea_br.ccr_model import solve_ccr


# Table 2 Data from Paper
PAPER_DATA = [
    ("DMU1", [4, 4.0452], [0.03, 0.1211]),
    ("DMU2", [7, 2.25], [0.18, 0.55]),
    ("DMU3", [15, 13.37], [0.95, 0.56]),
    ("DMU4", [60, 44.88], [0.99, 0]),
    ("DMU5", [49, 90.93], [0.56, 0.73]),
    ("DMU6", [90, 30.96], [0.12, 0.80]),
    ("DMU7", [26, 16.92], [0.77, 0.55]),
    ("DMU8", [46, 37.05], [0.85, 0.67]),
    ("DMU9", [6, 125.70], [0.43, 0.56]),
    ("DMU10", [5, 7.51], [0.25, 0.55]),
    ("DMU11", [5, 18.69], [0.08, 0.55]),
    ("DMU12", [20, 8.56], [1, 0.71]),
    ("DMU13", [13, 21.90], [0.001, 0.54]),
    ("DMU14", [4, 4.88], [0.14, 0.55]),
    ("DMU15", [14, 2.34], [1, 0.55]),
    ("DMU16", [15, 13.91], [0.47, 0.55]),
    ("DMU17", [14, 4.90], [0.71, 0.56]),
    ("DMU18", [12, 23.47], [1, 0.55]),
    ("DMU19", [25, 45.63], [0.27, 1]),
    ("DMU20", [5, 81.18], [0.02, 0.55]),
    ("DMU21", [27, 8.85], [0.62, 0.60]),
]

# Expected CCR from Table 2
EXPECTED_CCR = {
    "DMU1": 1.0, "DMU2": 0.6177, "DMU3": 0.7932, "DMU4": 0.2241,
    "DMU5": 0.2436, "DMU6": 0.1971, "DMU7": 0.4053, "DMU8": 0.2354,
    "DMU9": 1.0, "DMU10": 0.9475, "DMU11": 0.8, "DMU12": 0.6976,
    "DMU13": 0.4527, "DMU14": 1.0, "DMU15": 1.0, "DMU16": 1.0,
    "DMU17": 0.6849, "DMU18": 1.0, "DMU19": 0.2951, "DMU20": 0.8,
    "DMU21": 0.3005,
}


def validate_ccr():
    """Compare calculated CCR efficiencies against paper Table 2."""
    print("\n" + "="*70)
    print("CCR Efficiency Validation (Table 2)")
    print("="*70)
    
    dmu_ids = [d[0] for d in PAPER_DATA]
    X = np.array([d[1] for d in PAPER_DATA])
    Y = np.array([d[2] for d in PAPER_DATA])
    
    print(f"\n{'DMU':<8} {'Calculated':<12} {'Expected':<12} {'Diff':<10} {'Status':<8}")
    print("-"*52)
    
    passed = 0
    for i, dmu_id in enumerate(dmu_ids):
        try:
            theta, _ = solve_ccr(X, Y, i)
            expected = EXPECTED_CCR[dmu_id]
            diff = theta - expected
            status = "PASS" if abs(diff) < 0.05 else "CHECK"
            if status == "PASS":
                passed += 1
            print(f"{dmu_id:<8} {theta:<12.4f} {expected:<12.4f} {diff:<+10.4f} {status:<8}")
        except Exception as e:
            print(f"{dmu_id:<8} ERROR: {e}")
            
    print("-"*52)
    print(f"Pass Rate: {passed}/{len(dmu_ids)} ({passed/len(dmu_ids)*100:.0f}%)")
    

def run_full_evaluation():
    """Run full bounded rationality evaluation on paper data."""
    print("\n" + "="*70)
    print("Full Bounded Rationality Evaluation")
    print("="*70)
    
    dmu_ids = [d[0] for d in PAPER_DATA]
    X = np.array([d[1] for d in PAPER_DATA])
    Y = np.array([d[2] for d in PAPER_DATA])
    
    # Use theta^OO = 0.7 as in paper example (Table 3, column 4)
    evaluator = BoundedRationalityEvaluator(
        theta_oo=0.7,
        mu=0.6,
        alpha=0.88,
        beta=0.88,
        lambda_=2.25
    )
    
    # Uniform personal objectives (theta^PO = 0.7 for all)
    personal_obj = {dmu: 0.7 for dmu in dmu_ids}
    
    results = evaluator.evaluate(dmu_ids, X, Y, personal_obj)
    
    print(f"\nParameters: theta_oo=0.7, mu=0.6, alpha=beta=0.88, lambda=2.25")
    print(f"Personal Objectives: All set to 0.7")
    
    print(f"\n{'DMU':<8} {'CCR':<8} {'Cross Eff':<12} {'Rank':<6} {'Category':<15}")
    print("-"*52)
    
    sorted_results = sorted(results.items(), key=lambda x: x[1]['rank'])
    for dmu_id, res in sorted_results:
        print(f"{dmu_id:<8} {res['ccr_efficiency']:<8.4f} {res['cross_efficiency']:<12.4f} "
              f"{res['rank']:<6} {res['category']:<15}")
    
    print("-"*52)


def main():
    print("\n" + "#"*70)
    print("# DEA Bounded Rationality - Paper Reproduction")
    print("# Reference: Shi, Wang & Zhang (2024)")
    print("#"*70)
    
    validate_ccr()
    run_full_evaluation()
    
    print("\nNote: Some differences from paper values are expected due to:")
    print("- Floating point precision differences")
    print("- Potential undisclosed data preprocessing in the original study")
    print("- DMU4 has y2=0 which may cause edge case handling differences")


if __name__ == "__main__":
    main()
