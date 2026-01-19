from dea_br import BoundedRationalityEvaluator
import numpy as np

evaluator = BoundedRationalityEvaluator(theta_oo=0.7, mu=0.6)
results = evaluator.evaluate(
    dmu_ids=['A', 'B', 'C'],
    inputs=np.array([[10], [20], [30]]),
    outputs=np.array([[100], [150], [200]]),
    personal_objectives={'A': 0.8, 'B': 0.75, 'C': 0.7}
)