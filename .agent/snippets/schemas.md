# Data & Interaction Schemas

## Indicator Schema
```json
{
  "indicator": {
    "id": "string",
    "name": "string",
    "framework_id": "string",
    "type": "quantitative | qualitative",
    "unit": "string",
    "min_value": number,
    "max_value": number,
    "is_input": boolean,
    "is_effectiveness": boolean,
    "preprocessing": {
      "handle_zeros": "add_epsilon"
    }
  }
}
```

## Evaluation Schema
```json
{
  "evaluation": {
    "id": "string",
    "cycle_id": "string",
    "employee_id": "string",
    "status": "completed",
    "scores": {
      "indicator_name": number
    },
    "data_quality": {
      "all_positive": boolean,
      "zeros_found": number
    }
  }
}
```

## Results Schema
```json
{
  "cycle_results": {
    "id": "string",
    "status": "completed",
    "efficiency_scores": {
      "emp_id": {
        "self_evaluation": number,
        "cross_efficiency": number,
        "percentile": number
      }
    },
    "nine_box_matrix": {
      "cell_id": {
        "count": number,
        "profile": "string",
        "employees": ["string"]
      }
    }
  }
}
```
