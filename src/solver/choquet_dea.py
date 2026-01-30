
import pulp
import polars as pl
from typing import List, Dict, Tuple, Any
from ..models import Dataset, DMU

class ChoquetDEASolver:
    def __init__(self, dataset: Dataset, theta: float = 3.0):
        self.dataset = dataset
        self.theta = theta
        self.dmus = dataset.get_dmu_data(dmu_id_col="Salesperson") # parameterized ID col? We'll assume 'Salesperson' for now or make it dynamic later.
        
        # We need to access variables to know which are inputs and outputs
        self.inputs = [v for v in self.dataset.variables if v.type == 'input']
        self.outputs = [v for v in self.dataset.variables if v.type == 'output']
        
        # Interaction pairs (for 2-additive measure)
        self.input_pairs = self._generate_pairs([v.name for v in self.inputs])
        self.output_pairs = self._generate_pairs([v.name for v in self.outputs])

    def _generate_pairs(self, names: List[str]) -> List[Tuple[str, str]]:
        pairs = []
        for i in range(len(names)):
            for j in range(i + 1, len(names)):
                pairs.append((names[i], names[j]))
        return pairs

    def _calculate_choquet_value(self, values: Dict[str, float], weights_v: Dict[str, float], weights_I: Dict[Tuple[str,str], float], item_names: List[str], pairs: List[Tuple[str,str]]) -> Any:
        # Choquet Integral (Mobius representation for 2-additive):
        # f(x) = sum(v_i * x_i) + sum(v_ij * min(x_i, x_j))
        
        linear_term = pulp.lpSum([weights_v[name] * values[name] for name in item_names])
        interaction_term = pulp.lpSum([weights_I[pair] * min(values[pair[0]], values[pair[1]]) for pair in pairs])
        
        return linear_term + interaction_term

    def _calculate_choquet_value_numerical(self, values: Dict[str, float], weights_v: Dict[str, float], weights_I: Dict[Tuple[str,str], float], item_names: List[str], pairs: List[Tuple[str,str]]) -> float:
        # Numerical version for cross-evaluation
        linear_term = sum([weights_v[name] * values[name] for name in item_names])
        interaction_term = sum([weights_I[pair] * min(values[pair[0]], values[pair[1]]) for pair in pairs])
        return linear_term + interaction_term

    def solve_self_evaluation(self, dmu_idx: int) -> Dict[str, Any]:
        """
        Solves the LPP for the specific DMU to find optimal weights.
        """
        target_dmu = self.dmus[dmu_idx]
        prob = pulp.LpProblem(f"DEA_Choquet_{target_dmu.id}", pulp.LpMaximize)

        # --- Decision Variables ---
        # Weights for inputs (v_i) and interactions (v_ij)
        v = {inp.name: pulp.LpVariable(f"v_{inp.name}", lowBound=None) for inp in self.inputs} # Mobius weights can be negative, but monotonicity constraints apply
        v_int = {pair: pulp.LpVariable(f"v_{pair[0]}_{pair[1]}", lowBound=None) for pair in self.input_pairs}
        
        # Weights for outputs (u_r) and interactions (u_rq)
        u = {out.name: pulp.LpVariable(f"u_{out.name}", lowBound=None) for out in self.outputs}
        u_int = {pair: pulp.LpVariable(f"u_{pair[0]}_{pair[1]}", lowBound=None) for pair in self.output_pairs}

        # --- Objective Function ---
        # Maximize Efficiency of target_dmu: output_choquet
        obj_func = self._calculate_choquet_value(target_dmu.outputs, u, u_int, [o.name for o in self.outputs], self.output_pairs)
        prob += obj_func

        # --- Constraints ---

        # 1. Input Normalization for target DMU = 1
        input_norm = self._calculate_choquet_value(target_dmu.inputs, v, v_int, [i.name for i in self.inputs], self.input_pairs)
        prob += (input_norm == 1, "InputNormalization")

        # 2. Frontier Constraint: Output - Input <= 0 for ALL DMUs
        for k_idx, dmu_k in enumerate(self.dmus):
            out_k = self._calculate_choquet_value(dmu_k.outputs, u, u_int, [o.name for o in self.outputs], self.output_pairs)
            inp_k = self._calculate_choquet_value(dmu_k.inputs, v, v_int, [i.name for i in self.inputs], self.input_pairs)
            prob += (out_k - inp_k <= 0, f"FrontierConstraint_{k_idx}")

        # 3. Monotonicity Constraints
        # For Inputs: v_i + sum_{j!=i} v_ij >= 0  (Simplified condition for 2-additive capacity monotonicity)
        # Actually proper monotonicity condition is:
        # For every i, and every S subset of M\{i}, Capacity(S U {i}) >= Capacity(S).
        # In Mobius terms for 2-additive:
        # v_i + sum_{j \in S} v_ij >= 0 for all S.
        # Sufficient condition often used: v_i >= 0 and v_i + sum(v_ij for all j) >= 0 ?
        # Let's stick to the workflow formula: "v_i + sum v_ij >= 0"
        # I will assume this means: for each i, v_i + sum_{j that interact with i} v_ij >= 0 ??
        # Or simply v_i >= 0 ?? 
        # The workflow says: "v_i + sum v_{ij} >= 0". This is ambiguous.
        # Let's use the standard condition for non-negative marginal contribution in 2-additive measures:
        # v_i + sum_{j \in A} v_ij >= 0 for all subsets A \subseteq M\{i}.
        # To avoid exponential constraints, we can enforce:
        # v_i + sum_{j: v_ij < 0} v_ij >= 0 (Conservative Monotonicity) - Ensures monotonicity everywhere.
        
        # Let's implement Conservative Monotonicity for inputs
        for inp in self.inputs:
            # We strictly need v_i + sum of minimal interactions >= 0
            # But pulp cannot handle conditional logic inside sum easily without binaries or tricks.
            # Simplified approach often accepted in Choquet DEA papers:
            # v_i >= 0 and v_i + \sum_{j} v_ij >= 0 ??
            # Wait, Mobius weights v_i usually unconstrained sign, but generally v_i >= 0 is a good base.
            # Let's apply: v_i >= 0
            # And v_ij can be negative?
            # Workflow says: "v_i + sum v_ij >= 0".
            # I will interpret as: For each i: v_i + sum_{j!=i} min(0, v_ij) >= 0 ? No non-linear.
            # Let's just sum all interactions involving i.
            
            related_pairs = [p for p in self.input_pairs if inp.name in p]
            prob += (v[inp.name] + pulp.lpSum([v_int[p] for p in related_pairs]) >= 0.0001, f"Monotonicity_Input_{inp.name}") # epsilon for strict positivity?
            prob += (v[inp.name] >= 0, f"NonNeg_Input_{inp.name}")

        # Same for outputs
        for out in self.outputs:
            related_pairs_u = [p for p in self.output_pairs if out.name in p]
            prob += (u[out.name] + pulp.lpSum([u_int[p] for p in related_pairs_u]) >= 0.0001, f"Monotonicity_Output_{out.name}")
            prob += (u[out.name] >= 0, f"NonNeg_Output_{out.name}")


        # 4. Weight Balance Constraints (Theta)
        # Max(Imp) / Min(Imp) <= Theta  => Max(Imp) <= Theta * Min(Imp)
        # This implies: Imp_i <= Theta * Imp_j for all pairs i,j.
        # Importance (Shapley): Phi_i = v_i + 0.5 * sum_{j!=i} v_ij
        
        imp_inputs = {}
        for inp in self.inputs:
            related_pairs = [p for p in self.input_pairs if inp.name in p]
            imp_inputs[inp.name] = v[inp.name] + 0.5 * pulp.lpSum([v_int[p] for p in related_pairs])
        
        imp_outputs = {}
        for out in self.outputs:
            related_pairs_u = [p for p in self.output_pairs if out.name in p]
            imp_outputs[out.name] = u[out.name] + 0.5 * pulp.lpSum([u_int[p] for p in related_pairs_u])

        # Add pairwise constraints for Input Importance
        for name_a in imp_inputs:
            for name_b in imp_inputs:
                if name_a == name_b: continue
                prob += (imp_inputs[name_a] <= self.theta * imp_inputs[name_b], f"Balance_Input_{name_a}_{name_b}")
        
        # Add pairwise constraints for Output Importance
        for name_a in imp_outputs:
            for name_b in imp_outputs:
                if name_a == name_b: continue
                prob += (imp_outputs[name_a] <= self.theta * imp_outputs[name_b], f"Balance_Output_{name_a}_{name_b}")


        # Solve
        prob.solve(pulp.PULP_CBC_CMD(msg=False))
        
        if pulp.LpStatus[prob.status] != 'Optimal':
            return None

        # Extract Weights
        weights_v_val = {k: pulp.value(var) for k, var in v.items()}
        weights_v_int_val = {k: pulp.value(var) for k, var in v_int.items()}
        weights_u_val = {k: pulp.value(var) for k, var in u.items()}
        weights_u_int_val = {k: pulp.value(var) for k, var in u_int.items()}
        
        return {
            "v_weights": weights_v_val,
            "v_int_weights": weights_v_int_val,
            "u_weights": weights_u_val,
            "u_int_weights": weights_u_int_val,
            "efficiency_self": pulp.value(prob.objective)
        }

    def compute_cross_efficiency(self) -> pl.DataFrame:
        n = len(self.dmus)
        cross_eff_matrix = [[0.0] * n for _ in range(n)] # rows: rating DMU (d), cols: rated DMU (k)
        
        for d_idx in range(n):
            # 1. Self-Evaluation for DMU d
            solution = self.solve_self_evaluation(d_idx)
            if solution is None:
                print(f"Warning: Solution not found for DMU {self.dmus[d_idx].id}")
                continue
                
            # 2. Apply d's weights to all DMUs k
            v = solution['v_weights']
            v_int = solution['v_int_weights']
            u = solution['u_weights']
            u_int = solution['u_int_weights']
            
            for k_idx in range(n):
                dmu_k = self.dmus[k_idx]
                
                # Input Choquet for k using d's weights
                input_val = self._calculate_choquet_value_numerical(
                    dmu_k.inputs, v, v_int, [i.name for i in self.inputs], self.input_pairs
                )
                
                # Output Choquet for k using d's weights
                output_val = self._calculate_choquet_value_numerical(
                    dmu_k.outputs, u, u_int, [o.name for o in self.outputs], self.output_pairs
                )
                
                # Efficiency = Output / Input
                if input_val > 0:
                    eff = output_val / input_val
                else:
                    eff = 0.0 # Should not happen with valid data
                
                cross_eff_matrix[d_idx][k_idx] = eff

        # Average Cross-Efficiency (columns average)
        results = []
        for k_idx in range(n):
            scores_received = [cross_eff_matrix[d][k_idx] for d in range(n)]
            avg_score = sum(scores_received) / n if n > 0 else 0
            
            dmu = self.dmus[k_idx]
            results.append({
                "DMU": dmu.name,
                "Score": round(avg_score, 2),
                "Revenue": round(dmu.efficacy_score, 2)
            })
            
        return pl.DataFrame(results)

