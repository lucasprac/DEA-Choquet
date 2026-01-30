
import numpy as np
import pandas as pd
from pulp import *
from dataclasses import dataclass
from typing import Dict, List, Tuple, Optional, Any
import warnings
warnings.filterwarnings('ignore')

@dataclass
class DMU:
    """Decision-Making Unit"""
    name: str
    inputs: np.ndarray      # m input values
    outputs: np.ndarray     # s output values
    efficiency_ccr: float = None
    weights_input: np.ndarray = None
    weights_output: np.ndarray = None
    weights_interactions_input: np.ndarray = None
    weights_interactions_output: np.ndarray = None
    satisfaction: float = None

def normalize_data(dmus: List[DMU], method='divide_max') -> List[DMU]:
    """Normalize data to [0,1] for numerical stability"""
    if not dmus:
        return dmus
        
    n_inputs = len(dmus[0].inputs)
    n_outputs = len(dmus[0].outputs)
    
    # Normalize inputs
    for i in range(n_inputs):
        vals = np.array([d.inputs[i] for d in dmus])
        max_v = vals.max()
        if max_v < 1e-10: max_v = 1.0
        for d in dmus:
            d.inputs[i] = d.inputs[i] / max_v
    
    # Normalize outputs
    for i in range(n_outputs):
        vals = np.array([d.outputs[i] for d in dmus])
        max_v = vals.max()
        if max_v < 1e-10: max_v = 1.0
        for d in dmus:
            d.outputs[i] = d.outputs[i] / max_v
    
    return dmus

def estimate_choquet_interactions(dmus: List[DMU], indicator_type='output', method='correlation') -> np.ndarray:
    """
    Estimate 2-additive Choquet interaction indices I_ij
    """
    if not dmus:
        return np.zeros((0,0))
        
    n_criteria = (len(dmus[0].outputs) if indicator_type == 'output' 
                  else len(dmus[0].inputs))
    
    I = np.zeros((n_criteria, n_criteria))
    
    if method == 'correlation':
        all_values = []
        for dmu in dmus:
            values = dmu.outputs if indicator_type == 'output' else dmu.inputs
            all_values.append(values)
        
        data_matrix = np.array(all_values)
        
        # Proxy efficiency if not available
        efficiencies = np.array([d.efficiency_ccr if d.efficiency_ccr is not None else 0.5 for d in dmus])
        if np.all(efficiencies == 0.5):
             sums_in = np.array([np.sum(d.inputs) for d in dmus])
             sums_out = np.array([np.sum(d.outputs) for d in dmus])
             efficiencies = sums_out / (sums_in + 1e-10)

        for i in range(n_criteria):
            for j in range(i+1, n_criteria):
                min_vals = np.minimum(data_matrix[:, i], data_matrix[:, j])
                
                if np.std(min_vals) > 1e-10 and np.std(efficiencies) > 1e-10:
                    corr = np.corrcoef(min_vals, efficiencies)[0, 1]
                    I[i, j] = np.nan_to_num(corr) * 0.10
                    I[j, i] = I[i, j]
    
    return I

def _create_lp_variables(n_inputs, n_outputs):
    v = [LpVariable(f"v_{t}", lowBound=0) for t in range(n_inputs)]
    u = [LpVariable(f"u_{r}", lowBound=0) for r in range(n_outputs)]
    
    v_int = [[None]*n_inputs for _ in range(n_inputs)]
    for t in range(n_inputs):
        for p in range(t+1, n_inputs):
            v_int[t][p] = LpVariable(f"v_int_{t}_{p}", lowBound=-1, upBound=1)
            
    u_int = [[None]*n_outputs for _ in range(n_outputs)]
    for r in range(n_outputs):
        for q in range(r+1, n_outputs):
            u_int[r][q] = LpVariable(f"u_int_{r}_{q}", lowBound=-1, upBound=1)
            
    I_in = [LpVariable(f"I_in_{t}", lowBound=0) for t in range(n_inputs)]
    I_out = [LpVariable(f"I_out_{r}", lowBound=0) for r in range(n_outputs)]
    z_I = LpVariable("z_I", lowBound=0, upBound=1)
    z_O = LpVariable("z_O", lowBound=0, upBound=1)
    
    return v, u, v_int, u_int, I_in, I_out, z_I, z_O

def _calc_choquet(dmu, v, u, v_int, u_int, n_inputs, n_outputs):
    # Output Aggregation
    terms_y = [u[r] * dmu.outputs[r] for r in range(n_outputs)]
    for r in range(n_outputs):
        for q in range(r+1, n_outputs):
            terms_y.append(u_int[r][q] * min(dmu.outputs[r], dmu.outputs[q]))
    y = lpSum(terms_y)
    
    # Input Aggregation
    terms_x = [v[t] * dmu.inputs[t] for t in range(n_inputs)]
    for t in range(n_inputs):
        for p in range(t+1, n_inputs):
            terms_x.append(v_int[t][p] * min(dmu.inputs[t], dmu.inputs[p]))
    x = lpSum(terms_x)
    
    return y, x

def _add_global_importance_constraints(prob, n_inputs, n_outputs, I_in, I_out, v, u, v_int, u_int, z_I, z_O, rho):
    for t in range(n_inputs):
        interaction_sum_terms = []
        for p in range(n_inputs):
            if p == t: continue
            if p > t:
                 interaction_sum_terms.append(v_int[t][p])
            else:
                 interaction_sum_terms.append(v_int[p][t])
        
        prob += I_in[t] == v[t] + 0.5 * lpSum(interaction_sum_terms)
        prob += I_in[t] >= rho * z_I
        prob += I_in[t] <= z_I
    
    for r in range(n_outputs):
        interaction_sum_terms = []
        for q in range(n_outputs):
            if q == r: continue
            if q > r:
                interaction_sum_terms.append(u_int[r][q])
            else:
                interaction_sum_terms.append(u_int[q][r])

        prob += I_out[r] == u[r] + 0.5 * lpSum(interaction_sum_terms)
        prob += I_out[r] >= rho * z_O
        prob += I_out[r] <= z_O

def solve_2chccr_model(dmu_index: int, dmus: List[DMU], I_outputs: np.ndarray, I_inputs: np.ndarray, rho=0.5):
    """Solve 2-CHCCR model (Model 11) for a single DMU."""
    solver = PULP_CBC_CMD(msg=0)
    prob = LpProblem(f"2CHCCR_DMU_{dmu_index}", LpMaximize)
    
    dmu_eval = dmus[dmu_index]
    n_inputs = len(dmu_eval.inputs)
    n_outputs = len(dmu_eval.outputs)
    
    v, u, v_int, u_int, I_in, I_out, z_I, z_O = _create_lp_variables(n_inputs, n_outputs)
    
    cy_eval, cx_eval = _calc_choquet(dmu_eval, v, u, v_int, u_int, n_inputs, n_outputs)
    
    prob += cy_eval, "Maximize Output"
    prob += cx_eval == 1, "Normalization"
    
    for j, dmu_j in enumerate(dmus):
        cy_j, cx_j = _calc_choquet(dmu_j, v, u, v_int, u_int, n_inputs, n_outputs)
        prob += cy_j - cx_j <= 0
    
    _add_global_importance_constraints(prob, n_inputs, n_outputs, I_in, I_out, v, u, v_int, u_int, z_I, z_O, rho)
    
    prob.solve(solver)
    
    if prob.status != 1:
        return 0, np.zeros(n_inputs), np.zeros(n_outputs), np.zeros((n_inputs, n_inputs)), np.zeros((n_outputs, n_outputs))

    w_int_in = np.zeros((n_inputs, n_inputs))
    for t in range(n_inputs):
        for p in range(t+1, n_inputs):
            w_int_in[t, p] = value(v_int[t][p])
            
    w_int_out = np.zeros((n_outputs, n_outputs))
    for r in range(n_outputs):
        for q in range(r+1, n_outputs):
            w_int_out[r, q] = value(u_int[r][q])
            
    return value(cy_eval), np.array([value(v[t]) for t in range(n_inputs)]), np.array([value(u[r]) for r in range(n_outputs)]), w_int_in, w_int_out

def solve_ideal_noniideal_targets(dmu_eval_idx, dmu_target_idx, dmus, I_outputs, I_inputs, objective='max', rho=0.5):
    """Solve Model 12: Compute E^max_dj or E^min_dj"""
    solver = PULP_CBC_CMD(msg=0)
    prob = LpProblem(f"Targets_{objective}", LpMaximize if objective == 'max' else LpMinimize)
    
    dmu_eval = dmus[dmu_eval_idx]
    dmu_target = dmus[dmu_target_idx]
    n_inputs = len(dmu_eval.inputs)
    n_outputs = len(dmu_eval.outputs)
    
    v, u, v_int, u_int, I_in, I_out, z_I, z_O = _create_lp_variables(n_inputs, n_outputs)
    
    cy_target, cx_target = _calc_choquet(dmu_target, v, u, v_int, u_int, n_inputs, n_outputs)
    
    # Normalization on Target for fraction linearization
    prob += cx_target == 1
    prob += cy_target
    
    # Maintain D's efficiency
    E_d_opt = dmu_eval.efficiency_ccr if dmu_eval.efficiency_ccr else 1.0
    cy_eval, cx_eval = _calc_choquet(dmu_eval, v, u, v_int, u_int, n_inputs, n_outputs)
    prob += cy_eval - E_d_opt * cx_eval == 0
    
    # Feasibility for all others
    for dmu_j in dmus:
        cy_j, cx_j = _calc_choquet(dmu_j, v, u, v_int, u_int, n_inputs, n_outputs)
        prob += cy_j - cx_j <= 0
        
    _add_global_importance_constraints(prob, n_inputs, n_outputs, I_in, I_out, v, u, v_int, u_int, z_I, z_O, rho)
    
    prob.solve(solver)
    if prob.status != 1:
        return E_d_opt
    return value(prob.objective)

def check_satisfaction_feasibility(dmu_eval_idx, dmus, alpha, E_max, E_min, rho):
    """Check if satisfaction level alpha is feasible for Fairness principle."""
    solver = PULP_CBC_CMD(msg=0)
    prob = LpProblem("FeasibilityCheck", LpMaximize) # Objective doesn't matter
    
    dmu_eval = dmus[dmu_eval_idx]
    n_inputs = len(dmu_eval.inputs)
    n_outputs = len(dmu_eval.outputs)
    
    v, u, v_int, u_int, I_in, I_out, z_I, z_O = _create_lp_variables(n_inputs, n_outputs)
    
    cy_eval, cx_eval = _calc_choquet(dmu_eval, v, u, v_int, u_int, n_inputs, n_outputs)
    prob += cx_eval == 1
    
    E_d_opt = dmu_eval.efficiency_ccr if dmu_eval.efficiency_ccr else 1.0
    prob += cy_eval - E_d_opt * cx_eval == 0
    prob += cy_eval == E_d_opt # Effectively just this since cx=1
    
    for j, dmu_j in enumerate(dmus):
        if j == dmu_eval_idx: continue
        
        # Ranges
        e_max = E_max[dmu_eval_idx, j]
        e_min = E_min[dmu_eval_idx, j]
        
        if e_max > e_min + 1e-6:
             target_eff = e_min + alpha * (e_max - e_min)
             cy_j, cx_j = _calc_choquet(dmu_j, v, u, v_int, u_int, n_inputs, n_outputs)
             # y_j >= Target * x_j
             prob += cy_j - target_eff * cx_j >= 0
        
        # Basic efficiency constraint
        cy_j, cx_j = _calc_choquet(dmu_j, v, u, v_int, u_int, n_inputs, n_outputs)
        prob += cy_j - cx_j <= 0

    _add_global_importance_constraints(prob, n_inputs, n_outputs, I_in, I_out, v, u, v_int, u_int, z_I, z_O, rho)
    
    prob.solve(solver)
    return prob.status == 1

def run_choquet_evaluation(dmus: List[DMU], rho=0.5):
    # 1. Interactions
    I_out = estimate_choquet_interactions(dmus, 'output')
    I_in = estimate_choquet_interactions(dmus, 'input')
    
    # 2. Self Efficiency
    for i in range(len(dmus)):
        eff, v, u, vint, uint = solve_2chccr_model(i, dmus, I_out, I_in, rho)
        dmus[i].efficiency_ccr = eff
        dmus[i].weights_input = v
        dmus[i].weights_output = u
        
    # 3. Targets (E_max, E_min)
    n = len(dmus)
    E_max = np.zeros((n,n))
    E_min = np.zeros((n,n))
    for i in range(n):
        for j in range(n):
            E_max[i,j] = solve_ideal_noniideal_targets(i, j, dmus, I_out, I_in, 'max', rho)
            E_min[i,j] = solve_ideal_noniideal_targets(i, j, dmus, I_out, I_in, 'min', rho)
            
    # 4. Satisfaction (Fairness Bisection)
    final_cross_effs = np.zeros(n)
    
    for i in range(n):
        # Bisection for max alpha
        low, high = 0.0, 1.0
        best_alpha = 0.0
        
        # 10 iterations -> epsilon ~ 0.001
        for _ in range(12):
            mid = (low + high) / 2
            if check_satisfaction_feasibility(i, dmus, mid, E_max, E_min, rho):
                best_alpha = mid
                low = mid
            else:
                high = mid
                
        dmus[i].satisfaction = best_alpha
        
        # Compute Cross Efficiencies based on this alpha
        row_effs = []
        for j in range(n):
            val = E_min[i,j] + best_alpha * (E_max[i,j] - E_min[i,j])
            row_effs.append(val)
        final_cross_effs[i] = np.mean(row_effs)
        
    return final_cross_effs, E_max, E_min
