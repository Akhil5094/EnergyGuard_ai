"""
EnergyGuard AI - Isolation Forest Unsupervised Anomaly Detector
"""
import numpy as np
from sklearn.ensemble import IsolationForest
from typing import Tuple, Dict

class AnomalyDetector:
    def __init__(self, n_estimators: int = 100, contamination: float = 0.05, decision_threshold: float = -0.50):
        self.n_estimators = n_estimators
        self.contamination = contamination
        self.decision_threshold = decision_threshold
        self.model = IsolationForest(
            n_estimators=self.n_estimators,
            contamination=self.contamination,
            random_state=42
        )
        self.is_trained = False
        self._warmup_model()

    def _warmup_model(self):
        # Baseline training vectors: [Active Power kW, Current A, Voltage V, Power Factor]
        baseline_data = np.array([
            [9.85, 45.2, 231.4, 0.94],
            [16.4, 78.5, 229.8, 0.91],
            [3.82, 20.1, 232.1, 0.82],
            [6.72, 34.6, 230.5, 0.84],
            [10.2, 47.0, 230.0, 0.93],
            [15.1, 71.0, 229.5, 0.92],
            [4.10, 21.0, 231.0, 0.83],
            [9.50, 44.0, 230.8, 0.94],
        ])
        self.model.fit(baseline_data)
        self.is_trained = True

    def predict_anomaly(self, power_kw: float, current_a: float, voltage_v: float, power_factor: float) -> Tuple[bool, float, str]:
        if not self.is_trained:
            return False, 0.0, "Model warming up"

        vector = np.array([[power_kw, current_a, voltage_v, power_factor]])
        score = float(self.model.score_samples(vector)[0])
        is_anomaly = score < self.decision_threshold

        classification = "Normal Baseline"
        if is_anomaly:
            if power_kw > 22.0:
                classification = "High Energy Spike"
            elif power_factor < 0.78:
                classification = "Degraded Power Factor (Lagging Inductive)"
            elif voltage_v < 210.0 or voltage_v > 250.0:
                classification = "Grid Voltage Sag / Swell"
            else:
                classification = "Unusual Multidimensional Power Signature"

        return is_anomaly, round(score, 3), classification

anomaly_detector = AnomalyDetector()
