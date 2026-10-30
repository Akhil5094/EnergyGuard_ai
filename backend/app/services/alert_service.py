"""
EnergyGuard AI - Alert Management & Deduplication Service
"""
from typing import Optional, Dict

class AlertService:
    def __init__(self):
        # Cache to prevent duplicate alarms for the same ongoing machine state
        self._active_alert_cache: Dict[str, bool] = {}

    def should_trigger_alert(self, machine_id: str, alert_type: str) -> bool:
        cache_key = f"{machine_id}:{alert_type}"
        if self._active_alert_cache.get(cache_key, False):
            return False  # Suppress duplicate
        self._active_alert_cache[cache_key] = True
        return True

    def clear_alert(self, machine_id: str, alert_type: str):
        cache_key = f"{machine_id}:{alert_type}"
        self._active_alert_cache.pop(cache_key, None)

alert_service = AlertService()
