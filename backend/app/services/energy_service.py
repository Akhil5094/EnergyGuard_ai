"""
EnergyGuard AI - Energy Calculation & Analytics Service
"""

def calculate_active_power(voltage_v: float, current_a: float, power_factor: float = 0.92) -> float:
    """
    P(kW) = Voltage(V) * Current(A) * PowerFactor / 1000
    """
    if voltage_v <= 0 or current_a <= 0:
        return 0.0
    pf = max(0.1, min(1.0, power_factor))
    return round((voltage_v * current_a * pf) / 1000.0, 3)

def calculate_interval_energy(power_kw: float, interval_seconds: int) -> float:
    """
    Energy(kWh) = Power(kW) * Interval(seconds) / 3600
    """
    if power_kw <= 0 or interval_seconds <= 0:
        return 0.0
    return round((power_kw * interval_seconds) / 3600.0, 6)

def calculate_tod_cost(energy_kwh: float, base_tariff_inr: float, hour_of_day: int) -> float:
    """
    Time of Day (ToD) tariff structure:
    - Peak (18:00 - 22:00): +25% surcharge
    - Off-Peak (22:00 - 06:00): -20% rebate
    - Normal (06:00 - 18:00): Standard base tariff
    """
    if 18 <= hour_of_day < 22:
        rate = base_tariff_inr * 1.25
    elif hour_of_day >= 22 or hour_of_day < 6:
        rate = base_tariff_inr * 0.80
    else:
        rate = base_tariff_inr
    return round(energy_kwh * rate, 2)
