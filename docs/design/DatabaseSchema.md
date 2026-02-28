# ExpeGraph Database Schema

Full SQL definition: [`database/ExpeGraphDB_PostgreSQL.sql`](../../database/ExpeGraphDB_PostgreSQL.sql)

The schema is split into two diagrams for readability.

---

## Diagram 1 — Organisation & Auth

Covers: `users`, `labs`, `projects`, `roles`, `permissions`, `equipment`,
and all junction tables.

```mermaid
erDiagram
    users {
        int user_id PK
        varchar username
        varchar email
        varchar password_hash
        varchar first_name
        varchar last_name
        boolean is_active
        timestamptz created_at
        timestamptz last_login_at
    }

    labs {
        int lab_id PK
        varchar lab_name
        text description
        int lab_leader_id FK
        timestamptz created_at
    }

    projects {
        int project_id PK
        varchar project_name
        text description
        date start_date
        date end_date
        timestamptz created_at
    }

    roles {
        int role_id PK
        varchar role_name
        text description
    }

    permissions {
        int permission_id PK
        varchar permission_name
        text description
    }

    equipment {
        int equipment_id PK
        varchar equipment_name
        varchar manufacturer
        varchar model
        varchar serial_number
        date purchase_date
        date calibration_due
        varchar location
        text notes
        int lab_id FK
    }

    labs_projects {
        int lab_id PK
        int project_id PK
    }

    users_labs {
        int user_id PK
        int lab_id PK
        timestamptz joined_at
    }

    users_projects {
        int user_id PK
        int project_id PK
        timestamptz joined_at
    }

    users_roles {
        int user_id PK
        int role_id PK
    }

    roles_permissions {
        int role_id PK
        int permission_id PK
    }

    users ||--o{ labs : "leads (lab_leader_id)"
    labs ||--o{ equipment : "owns"

    labs ||--o{ labs_projects : ""
    projects ||--o{ labs_projects : ""

    users ||--o{ users_labs : ""
    labs ||--o{ users_labs : ""

    users ||--o{ users_projects : ""
    projects ||--o{ users_projects : ""

    users ||--o{ users_roles : ""
    roles ||--o{ users_roles : ""

    roles ||--o{ roles_permissions : ""
    permissions ||--o{ roles_permissions : ""
```

---

## Diagram 2 — Experimental Data

Covers: `batches`, `samples`, `devices`, `diodes`, `transistors`,
`tlms`, `resistors`, `device_parameters`, `measurements`.

```mermaid
erDiagram
    batches {
        int batch_id PK
        varchar batch_name
        text description
        date fabrication_date
        text treatment
        int project_id FK
        int lab_id FK
        timestamptz created_at
    }

    samples {
        int sample_id PK
        varchar sample_name
        text description
        text treatment
        json properties
        int batch_id FK
        timestamptz created_at
    }

    devices {
        int device_id PK
        varchar device_name
        varchar device_type
        int sample_id FK
    }

    device_parameters {
        int device_parameter_id PK
        int device_id FK
        varchar key
        text value
    }

    diodes {
        int diode_id PK
        varchar diode_name
        double size_um
        double chamfer_rad_um
        double barrier_height_ev
        double ideality_factor
        double rec_ratio
        double built_in_potential_v
        double carrier_concentration
        double max_current_a
        double voltage_at_max_current_v
        double breakdown_voltage_v
    }

    transistors {
        int transistor_id PK
        varchar transistor_name
        double gate_width_um
        double gate_length_um
        double mobility_cm2_vs
        double on_off_ratio
        double threshold_voltage_v
        double subthreshold_swing_mv_dec
        double sg_gap_um
        double dg_gap_um
    }

    tlms {
        int tlm_id PK
        double sheet_resistance_ohm_sq
        double contact_resistance_ohm
        double transfer_length_cm
    }

    resistors {
        int resistor_id PK
        varchar resistor_name
        double resistance_ohm
        double length_um
        double width_um
        int tlm_id FK
    }

    measurements {
        int measurement_id PK
        int device_id FK
        int equipment_id FK
        int user_id FK
        varchar measurement_type
        timestamptz measured_at
        double temperature_k
        text notes
        text data_file_path
    }

    batches ||--o{ samples : "contains"
    samples ||--o{ devices : "contains"
    devices ||--o{ device_parameters : "has"
    devices ||--o| diodes : "is"
    devices ||--o| transistors : "is"
    devices ||--o| resistors : "is"
    resistors }o--o| tlms : "grouped in"
    devices ||--o{ measurements : "has"
```

---

## Cross-Diagram Links

| Column         | Table          | References               |
| -------------- | -------------- | ------------------------ |
| `project_id`   | `batches`      | `projects.project_id`    |
| `lab_id`       | `batches`      | `labs.lab_id`            |
| `equipment_id` | `measurements` | `equipment.equipment_id` |
| `user_id`      | `measurements` | `users.user_id`          |

---

## Key Design Decisions

| Decision                                 | Rationale                                                                                                       |
| ---------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `samples.properties JSONB`               | Sample metadata (wafer, quarter, piece number) is lab-specific; JSONB avoids a table redesign for every new lab |
| `device_parameters` key-value table      | Escape hatch for device types not modelled by `diodes`/`transistors`/`resistors`                                |
| `diode_id` = `device_id` (shared PK)     | Enforces one-to-one relationship; avoids a redundant join column                                                |
| No `MeasurementData` table               | Data volume and sequential access patterns favour files over row-per-point storage                              |
| `data_file_path` relative to `DATA_ROOT` | Allows the data folder to be moved without updating every DB record                                             |
| `DOUBLE PRECISION` for all measurements  | 32-bit `FLOAT` loses precision for values like carrier concentration                                            |
| `tlm_id` FK uses `SET NULL` on delete    | Deleting a TLM analysis result should not delete the resistors themselves                                       |
| `lab_leader_id` nullable                 | Breaks the circular dependency between `users` and `labs` at creation time                                      |
