---
trigger: always_on
---

## Project Goals Document

**Project Title:** Development of a Multidimensional Sales Performance Evaluation Method: Integration of DEA–Choquet and Effectiveness Matrices.

### 1. Overview
The goal of this project is to build a robust methodology to evaluate salespeople performance, overcoming the limitations of traditional ranking methods. The proposed method is “hybrid” because it combines **operational efficiency** (process and resource utilization) with **commercial effectiveness** (financial results and goal achievement). [pmc.ncbi.nlm.nih](https://pmc.ncbi.nlm.nih.gov/articles/PMC9416928/)

### 2. Problem Statement
Traditional sales evaluation models (based only on volume) and classical DEA models (based on variable independence) have critical weaknesses.

- Unrealistic independence: They assume that variables such as “Number of Visits” and “Market Potential” do not interact with each other.  
- Weight benevolence: They allow salespeople to achieve high scores while effectively ignoring fundamental indicators (zero weights).  
- One-dimensionality: They often confuse “working hard” (effort) with “delivering results” (effect).  

### 3. Objectives of the Model
The project aims to implement a system that meets four fundamental pillars:

A. **Synergy Modeling (Choquet Integral):** Capture non-additive interactions between input indicators, recognizing that the salesperson’s effort has different weights depending on the market context.

B. **Stability and Balance (Weight Balance):** Impose mathematical constraints (\(\theta\)) to ensure that all performance indicators (KPIs) contribute to the final score, preventing statistical manipulation of results (Zhao-based component).

C. **Fairness in Evaluation (Cross-Efficiency):** Use cross-evaluation to generate a group consensus, eliminating the bias of excessively optimistic self-evaluation.

D. **Prescriptive Diagnosis (Cai Matrix):** Classify individuals in a 2x2 (or 2x4) Efficiency vs. Effectiveness matrix to guide specific interventions

***