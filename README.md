# Hybrid Performance Evaluation Model (DEA-Choquet)

This project implements a multidimensional sales performance evaluation method combining **DEA-Choquet Cross-Efficiency** (Operational Efficiency) and **Effectiveness Matrices** (Financial Results).

## Structure

- **`src/models.py`**: Data definition using Polars (DMUs, Variables).
- **`src/solver/choquet_dea.py`**: The optimization engine using `pulp` for Linear Programming. It implements the Zhao Cross-Efficiency model with Choquet Integral (2-additive).
- **`src/analysis/matrix.py`**: Logic for classifying salespeople into 4 Quadrants (Benchmark, Diligent, Opportunistic, Underperformer).

## Setup

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Usage

You can run the example script which uses mock data:

```bash
python main.py
```

This will output the optimization results and generate a `final_report.csv` with the classification of each salesperson.

## Evaluation Methodology

1. **Choquet DEA**: Calculates efficiency considering interactions between inputs (synergy) and weight balance constraints.
2. **Cross-Efficiency**: Reduces self-evaluation bias by averaging scores using peer weights.
3. **Decision Matrix**: Maps "Score Zhao" (Efficiency) vs "Revenue" (Efficacy) into diagnostic quadrants.
