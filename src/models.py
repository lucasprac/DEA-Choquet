import polars as pl
from dataclasses import dataclass
from typing import List, Dict, Optional

@dataclass
class Variable:
    """Definition of an input or output variable."""
    name: str
    code: str
    type: str  # 'input', 'output', 'efficacy'
    description: str

@dataclass
class DMU:
    """
    Decision Making Unit (Salesperson).
    Stores raw values for inputs, outputs, and efficacy metrics.
    """
    id: str
    name: str
    inputs: Dict[str, float]
    outputs: Dict[str, float]
    efficacy_score: float  # Z variable (Revenue)

class Dataset:
    """
    Manages the loading and structuring of DMU data using Polars.
    """
    def __init__(self):
        self.variables: List[Variable] = []
        self._data: Optional[pl.DataFrame] = None

    def define_variable(self, name: str, code: str, v_type: str, description: str = ""):
        self.variables.append(Variable(name, code, v_type, description))

    def load_from_dataframe(self, df: pl.DataFrame):
        """Loads data from a Polars DataFrame."""
        self._data = df

    def get_dmu_data(self, dmu_id_col: str) -> List[DMU]:
        """
        Converts the internal DataFrame to a list of DMU objects for the solver.
        This allows the solver to be agnostic of the underlying dataframe structure if needed,
        though we can also pass the dataframe directly for vectorized operations.
        """
        if self._data is None:
            raise ValueError("Data not loaded.")
        
        dmus = []
        # Identify variable columns
        input_cols = [v.name for v in self.variables if v.type == 'input']
        output_cols = [v.name for v in self.variables if v.type == 'output']
        efficacy_col = next((v.name for v in self.variables if v.type == 'efficacy'), None)

        for row in self._data.iter_rows(named=True):
            dmu = DMU(
                id=str(row[dmu_id_col]),
                name=str(row[dmu_id_col]), # Assume ID is name for now
                inputs={v_name: row[v_name] for v_name in input_cols},
                outputs={v_name: row[v_name] for v_name in output_cols},
                efficacy_score=row[efficacy_col] if efficacy_col else 0.0
            )
            dmus.append(dmu)
        return dmus

    @property
    def data(self) -> pl.DataFrame:
        return self._data
