# ExpeGraph Database Schema

Full SQL definition: [`database/ExpeGraphDB_PostgreSQL.sql`](../../database/ExpeGraphDB_PostgreSQL.sql)

The schema is split into two diagrams for readability. Cross-diagram foreign keys are listed in the table at the bottom.

---

## Diagram 1 — Organisation & Auth

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
        timestamp created_at
        timestamp last_login_at
    }

    labs {
        int lab_id PK
        varchar lab_name
        text description
        int lab_leader_id FK
        timestamp created_at
    }

    projects {
        int project_id PK
        varchar project_name
        text description
        text funding
        date start_date
        date end_date
        timestamp created_at
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
        int purchase_year
        date calibration_due
        varchar location
        text connecting_str
        text notes
    }

    labs_projects {
        int lab_id PK
        int project_id PK
    }

    users_labs {
        int user_id PK
        int lab_id PK
        varchar role
        timestamp joined_at
    }

    users_projects {
        int user_id PK
        int project_id PK
        varchar role
        timestamp joined_at
    }

    users_roles {
        int user_id PK
        int role_id PK
        date role_start_date
        date role_end_date
    }

    roles_permissions {
        int role_id PK
        int permission_id PK
    }

    labs_equipment {
        int lab_id PK
        int equipment_id PK
    }

    users ||--o| labs : "leads"
    labs ||--o{ labs_equipment : ""
    equipment ||--o{ labs_equipment : ""

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
        timestamp created_at
    }

    samples {
        int sample_id PK
        varchar sample_name
        text description
        text treatment
        json properties
        int batch_id FK
        timestamp created_at
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
        varchar geometry_type
        float anode_width_um
        float anode_length_um
        float chamfer_radius_um
        float anode_radius_um
        json geometry_properties
        float barrier_height_ev
        float ideality_factor
        float rec_ratio
        float built_in_potential_v
        double carrier_concentration
        float max_current_a
        float voltage_at_max_current_v
        float breakdown_voltage_v
    }

    transistors {
        int transistor_id PK
        varchar transistor_name
        varchar geometry_type
        float gate_width_um
        float gate_length_um
        float gate_inner_radius_um
        float gate_outer_radius_um
        float coverage_sector_degree
        json geometry_properties
        float mobility_cm2_vs
        float on_off_ratio
        float threshold_voltage_v
        float subthreshold_swing_mv_dec
        float sg_gap_um
        float dg_gap_um
    }

    tlms {
        int tlm_id PK
        varchar geometry_type
        float sheet_resistance_ohm_sq
        float contact_resistance_ohm
        float transfer_length_cm
    }

    resistors {
        int resistor_id PK
        varchar resistor_name
        varchar geometry_type
        float width_um
        float gap_um
        float inner_radius_um
        float outer_radius_um
        json geometry_properties
        float resistance_ohm
        int tlm_id FK
    }

    measurements {
        int measurement_id PK
        int device_id FK
        int sample_id FK
        int equipment_id FK
        int user_id FK
        varchar measurement_type
        timestamp measured_at
        float temperature_k
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
    devices ||--o{ measurements : "device measurement"
    samples ||--o{ measurements : "sample measurement"
```

---

## Cross-Diagram Foreign Keys

| Column | Table | References |
|--------|-------|-----------|
| `project_id` | `batches` | `projects.project_id` |
| `lab_id` | `batches` | `labs.lab_id` |
| `equipment_id` | `measurements` | `equipment.equipment_id` |
| `user_id` | `measurements` | `users.user_id` |

---

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| `samples.properties JSONB` | Sample metadata (wafer, quarter, piece number) varies by lab; JSONB avoids schema changes for each new lab type |
| `device_parameters` key-value table | Escape hatch for device types not covered by `diodes`/`transistors`/`resistors` |
| Shared PK on device extensions | `diode_id = device_id` enforces one-to-one and removes a redundant join column |
| `geometry_type` + nullable columns | Sparse columns for known geometries; `geometry_properties JSONB` absorbs unknown future types |
| `measurements` targets device OR sample | Some measurements (Hall effect, XRD, profilometry) apply to a sample before any device is fabricated |
| `CONSTRAINT measurements_target_check` | XOR enforces exactly one of `device_id` / `sample_id` is set — never both, never neither |
| No `MeasurementData` table | Sequential bulk reads favour files over row-per-point database storage |
| `data_file_path` relative to `DATA_ROOT` | Moving the data folder only requires updating one config value, not every DB record |
| `REAL` (32-bit float) | 7 significant digits is sufficient; saves space vs `DOUBLE PRECISION` |
| `tlm_id` FK uses `SET NULL` | Deleting a TLM analysis result should not delete the resistors |
| `lab_leader_id UNIQUE` | One user can lead at most one lab |
| `lab_leader_id` nullable | Breaks the circular dependency between `users` and `labs` at creation time |
| `role_start_date/end_date` on `users_roles` | Time-limited role assignments belong on the user–role relationship, not on the structural role–permission definition |
| `labs_equipment` junction table | Equipment can be shared between labs (e.g. shared TEM or XRD machine) |
| `purchase_year SMALLINT` | Year precision is sufficient; age is derived in the application |
| `connecting_str` on `equipment` | Stores VISA address or equivalent for direct instrument access |
