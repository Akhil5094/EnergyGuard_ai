from fastapi import APIRouter
from typing import Dict, Any

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/overview")
def get_analytics_overview() -> Dict[str, Any]:
    return {
        "factory_name": "Apex Precision Engineering Works",
        "currency": "INR",
        "currency_symbol": "₹",
        "tariff_per_kwh": 9.5,
        "total_energy_today_kwh": 622.6,
        "estimated_cost_inr": 5914.7,
        "current_power_demand_kw": 36.8,
        "peak_demand_kw": 51.2,
        "sanctioned_demand_kw": 65.0,
        "efficiency_score": 84,
        "potential_monthly_savings_inr": 15835.0
    }

@router.get("/tod-breakdown")
def get_tod_breakdown():
    return [
        {"slab": "Normal Hours (06:00 - 18:00)", "kwh": 340.5, "rate": 9.5, "cost": 3234.7},
        {"slab": "Evening Peak (18:00 - 22:00)", "kwh": 185.2, "rate": 11.88, "cost": 2200.2},
        {"slab": "Night Off-Peak (22:00 - 06:00)", "kwh": 96.9, "rate": 7.6, "cost": 736.4}
    ]
