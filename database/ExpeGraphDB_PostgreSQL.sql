-- =============================================================
-- ExpeGraph PostgreSQL Schema
-- Naming convention: snake_case, plural table names
-- Units encoded in column names where ambiguous
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
    -- is_active enables soft-delete: deactivate instead of hard-deleting,
    -- so FKs in measurements/etc. remain valid.
    is_active       BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    last_login_at   TIMESTAMPTZ
);

-- UNIQUE(lab_leader_id) ensures one user cannot lead more than one lab.
-- lab_leader_id is nullable to avoid a circular dependency with users at creation time.
CREATE TABLE labs (
    lab_id          SERIAL          PRIMARY KEY,
    lab_name        VARCHAR(100)    NOT NULL UNIQUE,
    description     TEXT,
    lab_leader_id   INT             UNIQUE REFERENCES users(user_id) ON DELETE SET NULL,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE TABLE projects (
    project_id      SERIAL          PRIMARY KEY,
    project_name    VARCHAR(100)    NOT NULL,
    description     TEXT,
    funding         TEXT,
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

-- Equipment is not tied to a single lab; use labs_equipment for the many-to-many relationship.
-- connecting_str: VISA address or equivalent, e.g. 'GPIB::24::INSTR'.
-- purchase_year: storing the year is sufficient; age is computed in the application.
CREATE TABLE equipment (
    equipment_id    SERIAL          PRIMARY KEY,
    equipment_name  VARCHAR(100)    NOT NULL,
    manufacturer    VARCHAR(100),
    model           VARCHAR(100),
    serial_number   VARCHAR(100)    UNIQUE,
    purchase_year   SMALLINT,
    calibration_due DATE,
    location        VARCHAR(100),
    connecting_str  TEXT,
    notes           TEXT
);

-- =============================================================
-- SECTION 2: MANY-TO-MANY JUNCTION TABLES
-- Composite primary keys prevent duplicate associations.
-- =============================================================

CREATE TABLE labs_projects (
    lab_id          INT             NOT NULL REFERENCES labs(lab_id)         ON DELETE CASCADE,
    project_id      INT             NOT NULL REFERENCES projects(project_id)  ON DELETE CASCADE,
    PRIMARY KEY (lab_id, project_id)
);

-- role: the user's position within the lab.
-- 'leader' here should stay consistent with labs.lab_leader_id (enforced by application logic).
CREATE TABLE users_labs (
    user_id         INT             NOT NULL REFERENCES users(user_id)   ON DELETE CASCADE,
    lab_id          INT             NOT NULL REFERENCES labs(lab_id)     ON DELETE CASCADE,
    role            VARCHAR(20)     NOT NULL DEFAULT 'member'
                                    CHECK (role IN ('leader', 'deputy_leader', 'member', 'student')),
    joined_at       TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, lab_id)
);

-- role: the user's role within this project, e.g. 'obtained_fund', 'lead_researcher', 'executor'.
CREATE TABLE users_projects (
    user_id         INT             NOT NULL REFERENCES users(user_id)        ON DELETE CASCADE,
    project_id      INT             NOT NULL REFERENCES projects(project_id)  ON DELETE CASCADE,
    role            VARCHAR(50),
    joined_at       TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, project_id)
);

-- role_start_date / role_end_date: a role assignment can be time-limited.
-- These dates belong here (user–role relationship), not in roles_permissions
-- (which is a permanent structural definition of what a role can do).
CREATE TABLE users_roles (
    user_id         INT             NOT NULL REFERENCES users(user_id)   ON DELETE CASCADE,
    role_id         INT             NOT NULL REFERENCES roles(role_id)   ON DELETE CASCADE,
    role_start_date DATE,
    role_end_date   DATE,
    PRIMARY KEY (user_id, role_id)
);

CREATE TABLE roles_permissions (
    role_id         INT             NOT NULL REFERENCES roles(role_id)        ON DELETE CASCADE,
    permission_id   INT             NOT NULL REFERENCES permissions(permission_id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- One lab can own many pieces of equipment; one piece of equipment may be shared between labs.
CREATE TABLE labs_equipment (
    lab_id          INT             NOT NULL REFERENCES labs(lab_id)          ON DELETE CASCADE,
    equipment_id    INT             NOT NULL REFERENCES equipment(equipment_id) ON DELETE CASCADE,
    PRIMARY KEY (lab_id, equipment_id)
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

-- Sample-specific fields (wafer, quarter, piece_number, size, etc.) go in JSONB properties.
-- This keeps the table generic for labs with different sample nomenclatures.
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

-- Extensibility: stores parameters for device types not covered by the specific tables below.
CREATE TABLE device_parameters (
    device_parameter_id SERIAL      PRIMARY KEY,
    device_id           INT         NOT NULL REFERENCES devices(device_id) ON DELETE CASCADE,
    key                 VARCHAR(100) NOT NULL,
    value               TEXT,
    UNIQUE (device_id, key)
);

-- =============================================================
-- SECTION 4: DEVICE TYPE EXTENSIONS
-- Each table's PK equals devices.device_id (shared primary key pattern).
-- Geometry types: 'rectangular', 'circular', 'other'.
-- geometry_properties JSONB stores parameters for the 'other' type.
-- =============================================================

CREATE TABLE diodes (
    diode_id                    INT             PRIMARY KEY REFERENCES devices(device_id) ON DELETE CASCADE,
    diode_name                  VARCHAR(50)     NOT NULL,
    geometry_type               VARCHAR(20)     NOT NULL CHECK (geometry_type IN ('rectangular', 'circular', 'other')),
    -- Rectangular geometry columns
    anode_width_um              REAL,
    anode_length_um             REAL,
    chamfer_radius_um           REAL,
    -- Circular geometry columns
    anode_radius_um             REAL,
    -- Unknown/future geometry
    geometry_properties         JSONB,
    -- Electrical parameters
    barrier_height_ev           REAL,
    ideality_factor             REAL,
    rec_ratio                   REAL,
    built_in_potential_v        REAL,
    carrier_concentration       DOUBLE PRECISION,  -- cm⁻³; DOUBLE PRECISION needed for values up to ~10²⁰
    max_current_a               REAL,
    voltage_at_max_current_v    REAL,
    breakdown_voltage_v         REAL
);

CREATE TABLE transistors (
    transistor_id               INT             PRIMARY KEY REFERENCES devices(device_id) ON DELETE CASCADE,
    transistor_name             VARCHAR(50)     NOT NULL,
    geometry_type               VARCHAR(20)     NOT NULL CHECK (geometry_type IN ('rectangular', 'circular', 'other')),
    -- Rectangular geometry columns
    gate_width_um               REAL,
    gate_length_um              REAL,
    -- Circular geometry columns
    gate_inner_radius_um        REAL,
    gate_outer_radius_um        REAL,
    coverage_sector_degree      REAL,
    -- Unknown/future geometry
    geometry_properties         JSONB,
    -- Electrical parameters
    mobility_cm2_vs             REAL,           -- cm²/(V·s)
    on_off_ratio                REAL,
    threshold_voltage_v         REAL,
    subthreshold_swing_mv_dec   REAL,
    sg_gap_um                   REAL,
    dg_gap_um                   REAL
);

-- geometry_type determines which calculation method was used to derive the TLM results.
CREATE TABLE tlms (
    tlm_id                  SERIAL          PRIMARY KEY,
    geometry_type           VARCHAR(20)     NOT NULL CHECK (geometry_type IN ('rectangular', 'circular', 'other')),
    sheet_resistance_ohm_sq REAL,
    contact_resistance_ohm  REAL,
    transfer_length_cm      REAL
);

CREATE TABLE resistors (
    resistor_id             INT             PRIMARY KEY REFERENCES devices(device_id) ON DELETE CASCADE,
    resistor_name           VARCHAR(50)     NOT NULL,
    geometry_type           VARCHAR(20)     NOT NULL CHECK (geometry_type IN ('rectangular', 'circular', 'other')),
    -- Rectangular geometry columns
    width_um                REAL,
    gap_um                  REAL,           -- gap between contact pads
    -- Circular geometry columns
    inner_radius_um         REAL,
    outer_radius_um         REAL,
    -- Unknown/future geometry
    geometry_properties     JSONB,
    -- Electrical parameters
    resistance_ohm          REAL,
    tlm_id                  INT             REFERENCES tlms(tlm_id) ON DELETE SET NULL
);

CREATE INDEX idx_resistors_tlm_id ON resistors(tlm_id);

-- =============================================================
-- SECTION 5: MEASUREMENTS
-- Raw data is stored in files; data_file_path is a relative path from DATA_ROOT.
-- A measurement targets either a device OR a sample (never both, never neither).
-- =============================================================

CREATE TABLE measurements (
    measurement_id      SERIAL          PRIMARY KEY,
    -- Exactly one of device_id or sample_id must be set.
    device_id           INT             REFERENCES devices(device_id) ON DELETE CASCADE,
    sample_id           INT             REFERENCES samples(sample_id) ON DELETE CASCADE,
    equipment_id        INT             REFERENCES equipment(equipment_id) ON DELETE SET NULL,
    user_id             INT             REFERENCES users(user_id)          ON DELETE SET NULL,
    measurement_type    VARCHAR(50)     NOT NULL,
    measured_at         TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    temperature_k       REAL,
    notes               TEXT,
    data_file_path      TEXT            NOT NULL,
    CONSTRAINT measurements_target_check CHECK (
        (device_id IS NOT NULL AND sample_id IS NULL) OR
        (device_id IS NULL     AND sample_id IS NOT NULL)
    )
);

CREATE INDEX idx_measurements_device_id    ON measurements(device_id);
CREATE INDEX idx_measurements_sample_id    ON measurements(sample_id);
CREATE INDEX idx_measurements_measured_at  ON measurements(measured_at);
CREATE INDEX idx_measurements_equipment_id ON measurements(equipment_id);
