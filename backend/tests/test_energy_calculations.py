"""
Unit Tests for EnergyGuard AI Energy Calculations & Anomaly Logic
"""
import pytest

def calculate_active_power(voltage_v: float, current_a: float, power_factor: float = 0.92) -> float:
    if voltage_v <= 0 or current_a <= 0:
        return 0.0
    return round((voltage_v * current_a * power_factor) / 1000.0, 3)

def calculate_interval_energy(power_kw: float, interval_seconds: int) -> float:
    if power_kw <= 0 or interval_seconds <= 0:
        return 0.0
    return round((power_kw * interval_seconds) / 3600.0, 6)

def calculate_tariff_cost(energy_kwh: float, tariff_inr: float = 9.5) -> float:
    return round(energy_kwh * tariff_inr, 2)

def test_active_power_calculation():
    # 230V, 45.2A, 0.94 PF -> 9.772 kW
    power = calculate_active_power(230.0, 45.2, 0.94)
    assert 9.7 < power < 9.9
    assert calculate_active_power(0, 45.2, 0.94) == 0.0

def test_interval_energy_accumulation():
    # 10 kW over 3600 seconds (1 hour) = 10 kWh
    energy = calculate_interval_energy(10.0, 3600)
    assert energy == 10.0

    # 10 kW over 2 seconds
    energy_2s = calculate_interval_energy(10.0, 2)
    assert round(energy_2s, 4) == 0.0056

def test_cost_calculation():
    # 100 kWh at 9.5 INR/kWh = 950 INR
    cost = calculate_tariff_cost(100.0, 9.5)
    assert cost == 950.0
