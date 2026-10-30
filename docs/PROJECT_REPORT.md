# Academic Engineering Project Report: EnergyGuard AI

**Project Title:** EnergyGuard AI – IoT-Enabled Intelligent Energy Monitoring and Optimization System for Small-Scale Manufacturing Industries  
**Department:** Electrical & Electronics Engineering / Computer Science & Engineering  
**Academic Year:** 2025–2026  
**Target UN SDGs:** SDG 7 (Affordable and Clean Energy) & SDG 9 (Industry, Innovation, and Infrastructure)  

---

## 1. Abstract

Electrical energy expenditure constitutes between 20% to 40% of the operational overhead in small-scale manufacturing industries (MSMEs). Due to financial constraints, small machine shops cannot afford commercial SCADA systems or expensive digital power quality analyzers. Consequently, factory owners operate reactively—only discovering energy waste or penalty surcharges when the monthly utility invoice arrives.

**EnergyGuard AI** addresses this challenge through an end-to-end cyber-physical IoT architecture. Low-cost edge microcontrollers (ESP32) are interfaced with non-invasive split-core current transformers (SCT-013) and voltage isolation sensors (ZMPT101B) to continuously measure RMS current, voltage, power factor, and active power. Telemetry packets are published every 2 seconds via MQTT over Wi-Fi to a FastAPI backend. An unsupervised machine learning algorithm (**Isolation Forest**) detects abnormal energy spikes, idle waste, and motor bearing friction without requiring labeled training datasets. Furthermore, an actionable energy conservation roadmap projects monthly kilowatt-hour and Indian Rupee (₹ INR) savings.

---

## 2. Empathy Map: Understanding the MSME Factory Owner

1. **SAYS:** *"Why is my electricity bill so unpredictably high every month?"*
2. **THINKS:** *"I am losing profit margin and paying for energy on machines that aren't producing."*
3. **DOES:** *"Checks machine health only after catastrophic mechanical breakdown or motor burnout."*
4. **FEELS:** *"Frustrated, helpless, and priced out of commercial industrial automation packages."*

---

## 3. Mathematical Foundations & Electrical Engineering Formulas

### 3.1 Active Power ($P$)
For single-phase alternating current:
$$P (\text{kW}) = \frac{V_{\text{RMS}} \times I_{\text{RMS}} \times \cos(\phi)}{1000}$$
Where:
- $V_{\text{RMS}}$ is the root-mean-square line voltage ($230\text{V}$ nominal).
- $I_{\text{RMS}}$ is the root-mean-square line current in Amperes.
- $\cos(\phi)$ is the active power factor (PF).

### 3.2 Discrete Interval Energy Integration ($\Delta E$)
$$E (\text{kWh}) = \sum_{k=1}^{N} \frac{P_k (\text{kW}) \times \Delta t_k (\text{seconds})}{3600}$$

### 3.3 SCT-013 Current Transformer Burden Resistor Calculation
The SCT-013-000 produces $50\text{ mA}$ secondary current at $100\text{ A}$ RMS primary current ($N = 2000$ turns). To interface with the ESP32 ADC ($V_{\text{AREF}} = 3.3\text{V}$):
$$I_{\text{secondary\_peak}} = \frac{I_{\text{primary\_RMS}} \times \sqrt{2}}{N_{\text{turns}}} = \frac{100 \times \sqrt{2}}{2000} \approx 0.0707\text{ A}$$
$$R_{\text{burden}} = \frac{V_{\text{AREF}} / 2}{I_{\text{secondary\_peak}}} = \frac{1.65\text{V}}{0.0707\text{ A}} \approx 23.3\ \Omega$$
A standard **$33\ \Omega$ precision metal-film resistor** is chosen to guarantee headroom and prevent ADC saturation during motor inrush transients.

---

## 4. AI Anomaly Detection: Isolation Forest

Unlike supervised classification (which requires thousands of labeled machine failure logs), **Isolation Forest** isolates observations by randomly selecting a feature and randomly splitting the value between the maximum and minimum. Since anomalies are "few and different", they require fewer splits to be isolated in the decision trees.

- **Feature Vector:** $X = [P_{\text{active}}, I_{\text{RMS}}, V_{\text{RMS}}, \text{PF}, \text{Load Ratio}]$
- **Anomaly Score Threshold:** Observations scoring $< -0.50$ are flagged as anomalies.
- **Categorization:**
  - *Load Spike:* Power exceeds $105\%$ of nameplate rated power.
  - *Idle Waste:* Motor drawing $> 20\%$ rated power with no productive strokes for $> 15$ mins.
  - *Power Factor Degradation:* $\cos(\phi) < 0.85$ (incurring utility reactive surcharge).

---

## 5. Typical Viva Voce Questions & Answers

**Q1: Why was the SCT-013 split-core CT chosen instead of a shunt resistor?**  
*Answer:* The SCT-013 provides galvanic isolation and can be clamped onto the live conductor without cutting mains cables or shutting down factory operations.

**Q2: How does the system handle Wi-Fi dropouts on industrial shopfloors?**  
*Answer:* The ESP32 firmware implements non-blocking reconnect loops with exponential backoff and cumulative energy integration so energy measurements are not lost during network jitter.

**Q3: How are the monthly monetary savings calculated?**  
*Answer:* Savings are determined using empirical baseline audit data:  
$$\text{Savings (₹/mo)} = \text{Idle Power (kW)} \times \text{Idle Hours/Day} \times \text{Working Days} \times \text{Tariff (₹/kWh)}$$
No arbitrary percentage claims are made.
