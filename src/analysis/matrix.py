
import polars as pl
from dataclasses import dataclass
from typing import List, Dict

@dataclass
class QuadrantDefinition:
    name: str # e.g., "Benchmark", "Diligent", etc.
    condition_code: str # "Q1", "Q2"...
    diagnosis: str

class PerformanceMatrix:
    """
    Analyzes the Efficiency vs Effectiveness matrix and classifies DMUs.
    """
    def __init__(self):
        self.quadrants = {
            "Q1": QuadrantDefinition("Benchmark", "Q1", "High Efficiency, High Revenue"),
            "Q2": QuadrantDefinition("Diligent (Ant)", "Q2", "High Efficiency, Low Revenue"),
            "Q3": QuadrantDefinition("Opportunistic (Spender)", "Q3", "Low Efficiency, High Revenue"),
            "Q4": QuadrantDefinition("Underperformer (Problematic)", "Q4", "Low Efficiency, Low Revenue")
        }

    def analyze(self, results_df: pl.DataFrame) -> pl.DataFrame:
        """
        Takes a DataFrame containing 'Score' and 'Revenue'.
        Computes thresholds and classifies each row.
        """
        # 1. Compute Thresholds (Averages)
        mu_eff = results_df["Score"].mean()
        mu_sales = results_df["Revenue"].mean()
        
        print(f"Thresholds: Avg Efficiency = {mu_eff:.4f}, Avg Revenue = {mu_sales:.4f}")

        # 2. Define Classification Logic
        def classify(row):
            eff = row["Score"]
            rev = row["Revenue"]
            
            is_high_eff = eff >= mu_eff
            is_high_rev = rev >= mu_sales
            
            if is_high_eff and is_high_rev:
                return "Q1"
            elif is_high_eff and not is_high_rev:
                return "Q2"
            elif not is_high_eff and is_high_rev:
                return "Q3"
            else:
                return "Q4"

        # 3. Apply Classification
        # Polars apply/map
        # We can also use expressions for speed
        
        # Using when/then for fully vectorized approach in Polars
        res = results_df.with_columns([
            pl.when((pl.col("Score") >= mu_eff) & (pl.col("Revenue") >= mu_sales))
            .then(pl.lit("Q1"))
            .when((pl.col("Score") >= mu_eff) & (pl.col("Revenue") < mu_sales))
            .then(pl.lit("Q2"))
            .when((pl.col("Score") < mu_eff) & (pl.col("Revenue") >= mu_sales))
            .then(pl.lit("Q3"))
            .otherwise(pl.lit("Q4"))
            .alias("Quadrant_Code")
        ])
        
        # Join definitions (optional, or just map descriptions)
        # For simplicity, we can just map the description strings based on the code
        # But creating a mapping dict and map_dict is easy
        
        q_names = {k: v.name for k, v in self.quadrants.items()}
        q_diags = {k: v.diagnosis for k, v in self.quadrants.items()}
        
        # map_dict requires strict mapping in recent polars or join
        # Just use map_elements (lambda) for small datasets or join for large.
        # Given this is sales teams (usually < 1000), map is fine, but join is idiomatic.
        
        # Let's simple use map_dict expression if available or just struct logic meant for "display"
        # We will iterate for text generation if needed, but for DataFrame we keep codes or add text columns.
        
        # Using a left join with a frames dictionary
        quad_df = pl.DataFrame({
            "Quadrant_Code": list(self.quadrants.keys()),
            "Quadrant_Name": [q.name for q in self.quadrants.values()],
            "Diagnosis": [q.diagnosis for q in self.quadrants.values()],
        })
        
        final_df = res.join(quad_df, on="Quadrant_Code", how="left")
        
        return final_df.sort("Score", descending=True)
