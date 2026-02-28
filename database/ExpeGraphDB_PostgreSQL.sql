-- =============================================================
-- ExpeGraph PostgreSQL Schema
-- Naming convention: snake_case, plural table names
-- All units are encoded in column names where ambiguous
-- =============================================================

CREATE SCHEMA IF NOT EXISTS expegraph;
SET search_path TO expegraph;

-- =============================================================
-- SECTION 1: AUTHENTICATION & ORGANISATION
-- =============================================================

CREATE TABLE users (
    user_id         SERIAL          PRIMARY KEY,
    username        VARCHAR(50)     NOT NULL UNIQUE,
    email           VARCHAR(255)    NOT NULL UNIQUE,
    password_hash   VARCHAR(255)    NOT NULL,
    first_name      VARCHAR(50),
    last_name       VARCHAR(50),
    is_active       BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    last_login_at   TIMESTAMPTZ
);

-- labs references users (lab_leader_id), so users must exist first.
-- lab_leader_id is nullable to break the circular dependency on creation.
CREATE TABLE labs (
    lab_id          SERIAL          PRIMARY KEY,
    lab_name        VARCHAR(100)    NOT NULL UNIQUE,
    description     TEXT,
    lab_leader_id   INT             REFERENCES users(user_id) ON DELETE SET NULL,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE TABLE projects (
    project_id      SERIAL          PRIMARY KEY,
    project_name    VARCHAR(100)    NOT NULL,
    description     TEXT,
    start_date      DATE,
    end_date        DATE,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE TABLE roles (
    role_id         SERIAL          PRIMARY KEY,
    role_name       VARCHAR(50)     NOT NULL UNIQUE,
    description     TEXT
);

CREATE TABLE permissions (
    permission_id   SERIAL          PRIMARY KEY,
    permission_name VARCHAR(100)    NOT NULL UNIQUE,
    description     TEXT
);

-- Equipment belongs to a lab.
-- 'Age' is a derived value; store purchase_date and compute age in the application.
CREATE TABLE equipment (
    equipment_id    SERIAL          PRIMARY KEY,
    equipment_name  VARCHAR(100)    NOT NULL,
    manufacturer    VARCHAR(100),
    model           VARCHAR(100),
    serial_number   VARCHAR(100)    UNIQUE,
    purchase_date   DATE,
    calibration_due DATE,
    location        VARCHAR(100),
    notes           TEXT,
    lab_id          INT             REFERENCES labs(lab_id) ON DELETE SET NULL
);

-- =============================================================
-- SECTION 2: MANY-TO-MANY JUNCTION TABLES
-- =============================================================

CREATE TABLE labs_projects (
    lab_id          INT             NOT NULL REFERENCES labs(lab_id)     ON DELETE CASCADE,
    project_id      INT             NOT NULL REFERENCES projects(project_id) ON DELETE CASCADE,
    PRIMARY KEY (lab_id, project_id)
);

CREATE TABLE users_labs (
    user_id         INT             NOT NULL REFERENCES users(user_id)   ON DELETE CASCADE,
    lab_id          INT             NOT NULL REFERENCES labs(lab_id)     ON DELETE CASCADE,
    joined_at       TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, lab_id)
);

CREATE TABLE users_projects (
    user_id         INT             NOT NULL REFERENCES users(user_id)   ON DELETE CASCADE,
    project_id      INT             NOT NULL REFERENCES projects(project_id) ON DELETE CASCADE,
    joined_at       TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, project_id)
);

CREATE TABLE users_roles (
    user_id         INT             NOT NULL REFERENCES users(user_id)   ON DELETE CASCADE,
    role_id         INT             NOT NULL REFERENCES roles(role_id)   ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

CREATE TABLE roles_permissions (
    role_id         INT             NOT NULL REFERENCES roles(role_id)        ON DELETE CASCADE,
    permission_id   INT             NOT NULL REFERENCES permissions(permission_id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- =============================================================
-- SECTION 3: EXPERIMENTAL DATA HIERARCHY
-- Batch → Sample → Device → Measurement
-- =============================================================

CREATE TABLE batches (
    batch_id            SERIAL          PRIMARY KEY,
    batch_name          VARCHAR(100)    NOT NULL UNIQUE,
    description         TEXT,
    fabrication_date    DATE            NOT NULL,
    treatment           TEXT,
    project_id          INT             REFERENCES projects(project_id) ON DELETE SET NULL,
    lab_id              INT             REFERENCES labs(lab_id)         ON DELETE SET NULL,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- Sample-specific fields (e.g. wafer, quarter, piece_number) vary by lab.
-- Store them in the JSONB 'properties' column rather than fixed columns.
-- Example for semiconductor labs:
--   properties = {"wafer": "Ga2O3O5632", "size_mm": 5, "quarter": "SE", "piece_number": 12}
CREATE TABLE samples (
    sample_id       SERIAL          PRIMARY KEY,
    sample_name     VARCHAR(50)     NOT NULL,
    description     TEXT,
    treatment       TEXT,
    properties      JSONB,
    batch_id        INT             NOT NULL REFERENCES batches(batch_id) ON DELETE CASCADE,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_samples_batch_id ON samples(batch_id);

CREATE TABLE devices (
    device_id       SERIAL          PRIMARY KEY,
    device_name     VARCHAR(50)     NOT NULL,
    device_type     VARCHAR(50)     NOT NULL,   -- e.g. 'diode', 'transistor', 'resistor'
    sample_id       INT             NOT NULL REFERENCES samples(sample_id) ON DELETE CASCADE
);

CREATE INDEX idx_devices_sample_id ON devices(sample_id);

-- Extensibility: stores parameters for device types not covered by specific tables.
CREATE TABLE device_parameters (
    device_parameter_id SERIAL      PRIMARY KEY,
    device_id           INT         NOT NULL REFERENCES devices(device_id) ON DELETE CASCADE,
    key                 VARCHAR(100) NOT NULL,
    value               TEXT,
    UNIQUE (device_id, key)
);

-- =============================================================
-- SECTION 4: DEVICE TYPE EXTENSIONS
-- Each table shares its PK with devices(device_id).
-- Deleting a device cascades to its type extension.
-- =============================================================

-- All sizes in micrometers, voltages in V, currents in A.
CREATE TABLE diodes (
    diode_id                    INT             PRIMARY KEY REFERENCES devices(device_id) ON DELETE CASCADE,
    diode_name                  VARCHAR(50)     NOT NULL,
    size_um                     DOUBLE PRECISION NOT NULL,
    chamfer_rad_um              DOUBLE PRECISION,           -- NULL if device is circular
    barrier_height_ev           DOUBLE PRECISION,
    ideality_factor             DOUBLE PRECISION,
    rec_ratio                   DOUBLE PRECISION,           -- rectification ratio
    built_in_potential_v        DOUBLE PRECISION,
    carrier_concentration       DOUBLE PRECISION,           -- cm⁻³
    max_current_a               DOUBLE PRECISION,
    voltage_at_max_current_v    DOUBLE PRECISION,
    breakdown_voltage_v         DOUBLE PRECISION
);

CREATE TABLE transistors (
    transistor_id               INT             PRIMARY KEY REFERENCES devices(device_id) ON DELETE CASCADE,
    transistor_name             VARCHAR(50)     NOT NULL,
    gate_width_um               DOUBLE PRECISION NOT NULL,
    gate_length_um              DOUBLE PRECISION NOT NULL,
    mobility_cm2_vs             DOUBLE PRECISION,           -- field-effect mobility in cm²/(V·s)
    on_off_ratio                DOUBLE PRECISION,
    threshold_voltage_v         DOUBLE PRECISION,
    subthreshold_swing_mv_dec   DOUBLE PRECISION,           -- mV/decade
    sg_gap_um                   DOUBLE PRECISION,           -- source-gate gap
    dg_gap_um                   DOUBLE PRECISION            -- drain-gate gap
);

-- TLMs are analysis results shared across a group of resistors.
CREATE TABLE tlms (
    tlm_id                  SERIAL          PRIMARY KEY,
    sheet_resistance_ohm_sq DOUBLE PRECISION,               -- Ω/□
    contact_resistance_ohm  DOUBLE PRECISION,               -- Ω
    transfer_length_cm      DOUBLE PRECISION                -- cm
);

CREATE TABLE resistors (
    resistor_id             INT             PRIMARY KEY REFERENCES devices(device_id) ON DELETE CASCADE,
    resistor_name           VARCHAR(50)     NOT NULL,
    resistance_ohm          DOUBLE PRECISION,
    length_um               DOUBLE PRECISION NOT NULL,      -- between contact pads
    width_um                DOUBLE PRECISION,               -- pad width
    tlm_id                  INT             REFERENCES tlms(tlm_id) ON DELETE SET NULL
);

CREATE INDEX idx_resistors_tlm_id ON resistors(tlm_id);

-- =============================================================
-- SECTION 5: MEASUREMENTS
-- Raw data is stored in files; data_file_path points to the file.
-- MeasurementData and MeasurementTypes tables are intentionally omitted.
-- =============================================================

CREATE TABLE measurements (
    measurement_id      SERIAL          PRIMARY KEY,
    device_id           INT             NOT NULL REFERENCES devices(device_id)    ON DELETE CASCADE,
    equipment_id        INT             REFERENCES equipment(equipment_id)         ON DELETE SET NULL,
    user_id             INT             REFERENCES users(user_id)                  ON DELETE SET NULL,
    measurement_type    VARCHAR(50)     NOT NULL,           -- e.g. 'I-V', 'C-V', 'TLM'
    measured_at         TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    temperature_k       DOUBLE PRECISION,
    notes               TEXT,
    data_file_path      TEXT            NOT NULL            -- relative path from DATA_ROOT
);

CREATE INDEX idx_measurements_device_id    ON measurements(device_id);
CREATE INDEX idx_measurements_measured_at  ON measurements(measured_at);
CREATE INDEX idx_measurements_equipment_id ON measurements(equipment_id);
