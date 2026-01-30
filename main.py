
import polars as pl
from src.models import Dataset
from src.solver.choquet_dea import ChoquetDEASolver
from src.analysis.matrix import PerformanceMatrix

def main():
    # 1. Setup Dataset & Variables
    dataset = Dataset()
    
    # Inputs
    dataset.define_variable("Working Hours", "x1", "input")
    dataset.define_variable("Visits", "x2", "input") # Active effort
    dataset.define_variable("Market Potential", "x3", "input") # Context
    
    # Outputs
    dataset.define_variable("Orders", "y1", "output")
    dataset.define_variable("Units Sold", "y2", "output")
    
    # Efficacy (The Y-Axis of the Matrix)
    dataset.define_variable("Total Revenue", "Z", "efficacy")

    # 2. Mock Data (5 Salespeople)
    data = pl.DataFrame({
        "Salesperson": ["Alice", "Bob", "Charlie", "Diana", "Eve"],
        "Working Hours": [160, 180, 150, 160, 200], # x1
        "Visits": [40, 50, 30, 45, 60], # x2
        "Market Potential": [1000, 1200, 800, 1000, 1500], # x3 (Context)
        "Orders": [10, 12, 5, 11, 14], # y1
        "Units Sold": [500, 600, 250, 550, 650], # y2
        "Total Revenue": [50000, 60000, 25000, 55000, 65000] # Z
    })
    
    print("Loading Data...")
    dataset.load_from_dataframe(data)
    
    # 3. Initialize Solver (Theta=3 for balance)
    print("Initializing Solver (Cross-Efficiency)...")
    solver = ChoquetDEASolver(dataset, theta=3.0)
    
    # 4. Run Optimization
    print("Running Optimization (this uses Linear Programming)...")
    results = solver.compute_cross_efficiency()
    
    print("\noptimization Results (Score):")
    print(results)
    
    # 5. Matrix Analysis
    print("\nGenerating Diagnostic Matrix...")
    matrix_tool = PerformanceMatrix()
    final_report = matrix_tool.analyze(results)
    
    print("\n=== Final Report ===")
    print(final_report)
    
    # Optional: Save to CSV
    final_report.write_csv("final_report.csv")
    print("\nSaved report to 'final_report.csv'.")

if __name__ == "__main__":
    main()
