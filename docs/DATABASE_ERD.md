# EnergyGuard AI – Database Schema & Entity Relationship Diagram (ERD)

```
+--------------------+           +------------------------+
|      FACTORIES     |           |         USERS          |
+--------------------+           +------------------------+
| id (PK)            |<----+     | id (PK)                |
| name               |     |     | name                   |
| location           |     |     | email (Unique)         |
| timezone           |     |     | password_hash          |
| electricity_tariff |     |     | role (Owner/Mgr/Sup)   |
| created_at         |     |     | created_at             |
+--------------------+     |     +------------------------+
          |                |
          | 1:N            |
          v                |
+--------------------+     |
|      MACHINES      |     |
+--------------------+     |
| id (PK)            |     |
| factory_id (FK) ---+-----+
| name               |
| machine_type       |
| location           |
| rated_power_kw     |
| status             |
| created_at         |
+--------------------+
     |          |
     | 1:1      | 1:N
     v          v
+-----------------------+     +-----------------------+
|      IOT_DEVICES      |     |    ENERGY_READINGS    |
+-----------------------+     +-----------------------+
| id (PK)               |     | id (PK, Auto)         |
| device_id (Unique)    |     | machine_id (FK)       |
| machine_id (FK)       |     | device_id             |
| mqtt_topic            |     | timestamp (Indexed)   |
| firmware_version      |     | voltage_v             |
| connection_status     |     | current_a             |
| last_seen             |     | power_factor          |
+-----------------------+     | power_kw              |
                              | energy_kwh            |
                              | operating_status      |
                              | source (edge/sim)     |
                              +-----------------------+
                                          |
                                          |
                                          v
                              +-----------------------+
                              |        ALERTS         |
                              +-----------------------+
                              | id (PK)               |
                              | factory_id (FK)       |
                              | machine_id (FK)       |
                              | alert_type            |
                              | severity (Crit/Warn)  |
                              | title                 |
                              | description           |
                              | triggered_value       |
                              | threshold             |
                              | status (Act/Ack/Res)  |
                              | resolution_notes      |
                              | timestamp             |
                              +-----------------------+
```
