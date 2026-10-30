/**
 * EnergyGuard AI - Electrical & Energy Calculations Module
 * Conforms to academic engineering standards for industrial energy auditing.
 */

/**
 * Computes active electrical power in kilowatts (kW) for single-phase measurement
 * P(kW) = Voltage(V) * Current(A) * Power Factor / 1000
 */
export function calculateActivePowerKw(
  voltageV: number,
  currentA: number,
  powerFactor: number = 0.92
): number {
  if (voltageV <= 0 || currentA <= 0) return 0;
  const clampedPf = Math.max(0.1, Math.min(1.0, powerFactor));
  const powerWatts = voltageV * currentA * clampedPf;
  return Number((powerWatts / 1000).toFixed(3));
}

/**
 * Computes incremental energy consumed over a discrete sampling duration
 * Energy(kWh) = Power(kW) * Interval(seconds) / 3600
 */
export function calculateIntervalEnergyKwh(
  powerKw: number,
  intervalSeconds: number
): number {
  if (powerKw <= 0 || intervalSeconds <= 0) return 0;
  return Number(((powerKw * intervalSeconds) / 3600).toFixed(6));
}

/**
 * Computes electricity expenditure based on unit tariff (INR/kWh)
 * Cost(INR) = Energy(kWh) * Tariff(INR/kWh)
 */
export function calculateElectricityCost(
  energyKwh: number,
  tariffPerKwh: number = 9.5
): number {
  return Number((energyKwh * tariffPerKwh).toFixed(2));
}

/**
 * Format currency in Indian Rupees
 */
export function formatCurrencyINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 1,
  }).format(amount);
}

/**
 * Format numbers with compact representation
 */
export function formatCompact(value: number, decimals: number = 1): string {
  return value.toLocaleString('en-IN', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  });
}
