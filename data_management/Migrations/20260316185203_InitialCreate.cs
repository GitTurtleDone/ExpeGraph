using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace DataManagement.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "expegraph");

            migrationBuilder.CreateTable(
                name: "equipment",
                schema: "expegraph",
                columns: table => new
                {
                    equipment_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    equipment_name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    manufacturer = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    model = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    serial_number = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    purchase_year = table.Column<short>(type: "smallint", nullable: true),
                    calibration_due = table.Column<DateOnly>(type: "date", nullable: true),
                    location = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    connecting_str = table.Column<string>(type: "text", nullable: true),
                    notes = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_equipment", x => x.equipment_id);
                });

            migrationBuilder.CreateTable(
                name: "permissions",
                schema: "expegraph",
                columns: table => new
                {
                    permission_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    permission_name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    description = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_permissions", x => x.permission_id);
                });

            migrationBuilder.CreateTable(
                name: "projects",
                schema: "expegraph",
                columns: table => new
                {
                    project_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    project_name = table.Column<string>(type: "text", nullable: false),
                    description = table.Column<string>(type: "text", nullable: true),
                    funding = table.Column<string>(type: "text", nullable: true),
                    start_date = table.Column<DateOnly>(type: "date", nullable: true),
                    end_date = table.Column<DateOnly>(type: "date", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_projects", x => x.project_id);
                });

            migrationBuilder.CreateTable(
                name: "roles",
                schema: "expegraph",
                columns: table => new
                {
                    role_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    role_name = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    description = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_roles", x => x.role_id);
                });

            migrationBuilder.CreateTable(
                name: "tlms",
                schema: "expegraph",
                columns: table => new
                {
                    tlm_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    geometry_type = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    sheet_resistance_ohm_sq = table.Column<float>(type: "real", nullable: true),
                    contact_resistance_ohm = table.Column<float>(type: "real", nullable: true),
                    transfer_length_cm = table.Column<float>(type: "real", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tlms", x => x.tlm_id);
                    table.CheckConstraint("CK_tlms_geometry_type", "geometry_type IN ('rectangular', 'circular', 'other')");
                });

            migrationBuilder.CreateTable(
                name: "users",
                schema: "expegraph",
                columns: table => new
                {
                    user_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    username = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    email = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    password_hash = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    first_name = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    last_name = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    is_active = table.Column<bool>(type: "boolean", nullable: false, defaultValueSql: "TRUE"),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()"),
                    last_login_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_users", x => x.user_id);
                });

            migrationBuilder.CreateTable(
                name: "roles_permissions",
                schema: "expegraph",
                columns: table => new
                {
                    role_id = table.Column<int>(type: "integer", nullable: false),
                    permission_id = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_roles_permissions", x => new { x.role_id, x.permission_id });
                    table.ForeignKey(
                        name: "FK_roles_permissions_permissions_permission_id",
                        column: x => x.permission_id,
                        principalSchema: "expegraph",
                        principalTable: "permissions",
                        principalColumn: "permission_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_roles_permissions_roles_role_id",
                        column: x => x.role_id,
                        principalSchema: "expegraph",
                        principalTable: "roles",
                        principalColumn: "role_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "labs",
                schema: "expegraph",
                columns: table => new
                {
                    lab_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    lab_name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    description = table.Column<string>(type: "text", nullable: true),
                    lab_leader_id = table.Column<int>(type: "integer", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_labs", x => x.lab_id);
                    table.ForeignKey(
                        name: "FK_labs_users_lab_leader_id",
                        column: x => x.lab_leader_id,
                        principalSchema: "expegraph",
                        principalTable: "users",
                        principalColumn: "user_id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "users_projects",
                schema: "expegraph",
                columns: table => new
                {
                    user_id = table.Column<int>(type: "integer", nullable: false),
                    project_id = table.Column<int>(type: "integer", nullable: false),
                    role = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    joined_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_users_projects", x => new { x.user_id, x.project_id });
                    table.ForeignKey(
                        name: "FK_users_projects_projects_project_id",
                        column: x => x.project_id,
                        principalSchema: "expegraph",
                        principalTable: "projects",
                        principalColumn: "project_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_users_projects_users_user_id",
                        column: x => x.user_id,
                        principalSchema: "expegraph",
                        principalTable: "users",
                        principalColumn: "user_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "users_roles",
                schema: "expegraph",
                columns: table => new
                {
                    user_id = table.Column<int>(type: "integer", nullable: false),
                    role_id = table.Column<int>(type: "integer", nullable: false),
                    role_start_date = table.Column<DateOnly>(type: "date", nullable: true),
                    role_end_date = table.Column<DateOnly>(type: "date", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_users_roles", x => new { x.user_id, x.role_id });
                    table.ForeignKey(
                        name: "FK_users_roles_roles_role_id",
                        column: x => x.role_id,
                        principalSchema: "expegraph",
                        principalTable: "roles",
                        principalColumn: "role_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_users_roles_users_user_id",
                        column: x => x.user_id,
                        principalSchema: "expegraph",
                        principalTable: "users",
                        principalColumn: "user_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "batches",
                schema: "expegraph",
                columns: table => new
                {
                    batch_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    batch_name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    description = table.Column<string>(type: "text", nullable: true),
                    fabrication_date = table.Column<DateOnly>(type: "date", nullable: false),
                    treatment = table.Column<string>(type: "text", nullable: true),
                    project_id = table.Column<int>(type: "integer", nullable: true),
                    lab_id = table.Column<int>(type: "integer", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_batches", x => x.batch_id);
                    table.ForeignKey(
                        name: "FK_batches_labs_lab_id",
                        column: x => x.lab_id,
                        principalSchema: "expegraph",
                        principalTable: "labs",
                        principalColumn: "lab_id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_batches_projects_project_id",
                        column: x => x.project_id,
                        principalSchema: "expegraph",
                        principalTable: "projects",
                        principalColumn: "project_id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "labs_equipment",
                schema: "expegraph",
                columns: table => new
                {
                    lab_id = table.Column<int>(type: "integer", nullable: false),
                    equipment_id = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_labs_equipment", x => new { x.lab_id, x.equipment_id });
                    table.ForeignKey(
                        name: "FK_labs_equipment_equipment_equipment_id",
                        column: x => x.equipment_id,
                        principalSchema: "expegraph",
                        principalTable: "equipment",
                        principalColumn: "equipment_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_labs_equipment_labs_lab_id",
                        column: x => x.lab_id,
                        principalSchema: "expegraph",
                        principalTable: "labs",
                        principalColumn: "lab_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "labs_projects",
                schema: "expegraph",
                columns: table => new
                {
                    lab_id = table.Column<int>(type: "integer", nullable: false),
                    project_id = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_labs_projects", x => new { x.lab_id, x.project_id });
                    table.ForeignKey(
                        name: "FK_labs_projects_labs_lab_id",
                        column: x => x.lab_id,
                        principalSchema: "expegraph",
                        principalTable: "labs",
                        principalColumn: "lab_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_labs_projects_projects_project_id",
                        column: x => x.project_id,
                        principalSchema: "expegraph",
                        principalTable: "projects",
                        principalColumn: "project_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "users_labs",
                schema: "expegraph",
                columns: table => new
                {
                    user_id = table.Column<int>(type: "integer", nullable: false),
                    lab_id = table.Column<int>(type: "integer", nullable: false),
                    role = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false, defaultValue: "member"),
                    joined_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_users_labs", x => new { x.user_id, x.lab_id });
                    table.CheckConstraint("CK_users_labs_role", "role IN ('leader', 'deputy_leader', 'member', 'student')");
                    table.ForeignKey(
                        name: "FK_users_labs_labs_lab_id",
                        column: x => x.lab_id,
                        principalSchema: "expegraph",
                        principalTable: "labs",
                        principalColumn: "lab_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_users_labs_users_user_id",
                        column: x => x.user_id,
                        principalSchema: "expegraph",
                        principalTable: "users",
                        principalColumn: "user_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "samples",
                schema: "expegraph",
                columns: table => new
                {
                    sample_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    sample_name = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    description = table.Column<string>(type: "text", nullable: true),
                    treatment = table.Column<string>(type: "text", nullable: true),
                    properties = table.Column<Dictionary<string, object>>(type: "jsonb", nullable: true),
                    batch_id = table.Column<int>(type: "integer", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_samples", x => x.sample_id);
                    table.ForeignKey(
                        name: "FK_samples_batches_batch_id",
                        column: x => x.batch_id,
                        principalSchema: "expegraph",
                        principalTable: "batches",
                        principalColumn: "batch_id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "devices",
                schema: "expegraph",
                columns: table => new
                {
                    device_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    device_name = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    device_type = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    sample_id = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_devices", x => x.device_id);
                    table.ForeignKey(
                        name: "FK_devices_samples_sample_id",
                        column: x => x.sample_id,
                        principalSchema: "expegraph",
                        principalTable: "samples",
                        principalColumn: "sample_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "device_parameters",
                schema: "expegraph",
                columns: table => new
                {
                    device_parameter_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    device_id = table.Column<int>(type: "integer", nullable: false),
                    key = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    value = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_device_parameters", x => x.device_parameter_id);
                    table.ForeignKey(
                        name: "FK_device_parameters_devices_device_id",
                        column: x => x.device_id,
                        principalSchema: "expegraph",
                        principalTable: "devices",
                        principalColumn: "device_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "diodes",
                schema: "expegraph",
                columns: table => new
                {
                    diode_id = table.Column<int>(type: "integer", nullable: false),
                    geometry_type = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    anode_width_um = table.Column<float>(type: "real", nullable: true),
                    anode_length_um = table.Column<float>(type: "real", nullable: true),
                    chamfer_radius_um = table.Column<float>(type: "real", nullable: true),
                    anode_radius_um = table.Column<float>(type: "real", nullable: true),
                    geometry_properties = table.Column<Dictionary<string, object>>(type: "jsonb", nullable: true),
                    barrier_height_ev = table.Column<float>(type: "real", nullable: true),
                    ideality_factor = table.Column<float>(type: "real", nullable: true),
                    rec_ratio = table.Column<float>(type: "real", nullable: true),
                    built_in_potential_v = table.Column<float>(type: "real", nullable: true),
                    carrier_concentration = table.Column<double>(type: "double precision", nullable: true),
                    max_current_a = table.Column<float>(type: "real", nullable: true),
                    voltage_at_max_current_v = table.Column<float>(type: "real", nullable: true),
                    breakdown_voltage_v = table.Column<float>(type: "real", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_diodes", x => x.diode_id);
                    table.CheckConstraint("CK_diodes_geometry_type", "geometry_type IN ('rectangular', 'circular', 'other')");
                    table.ForeignKey(
                        name: "FK_diodes_devices_diode_id",
                        column: x => x.diode_id,
                        principalSchema: "expegraph",
                        principalTable: "devices",
                        principalColumn: "device_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "measurements",
                schema: "expegraph",
                columns: table => new
                {
                    measurement_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    device_id = table.Column<int>(type: "integer", nullable: true),
                    sample_id = table.Column<int>(type: "integer", nullable: true),
                    equipment_id = table.Column<int>(type: "integer", nullable: true),
                    user_id = table.Column<int>(type: "integer", nullable: true),
                    measurement_type = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    measured_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()"),
                    temperature_k = table.Column<float>(type: "real", nullable: true),
                    humidity_percent = table.Column<float>(type: "real", nullable: true),
                    notes = table.Column<string>(type: "text", nullable: true),
                    data_file_path = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_measurements", x => x.measurement_id);
                    table.CheckConstraint("measurements_target_check", "(device_id IS NOT NULL AND sample_id IS NULL) OR (device_id IS NULL AND sample_id IS NOT NULL)");
                    table.ForeignKey(
                        name: "FK_measurements_devices_device_id",
                        column: x => x.device_id,
                        principalSchema: "expegraph",
                        principalTable: "devices",
                        principalColumn: "device_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_measurements_equipment_equipment_id",
                        column: x => x.equipment_id,
                        principalSchema: "expegraph",
                        principalTable: "equipment",
                        principalColumn: "equipment_id");
                    table.ForeignKey(
                        name: "FK_measurements_samples_sample_id",
                        column: x => x.sample_id,
                        principalSchema: "expegraph",
                        principalTable: "samples",
                        principalColumn: "sample_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_measurements_users_user_id",
                        column: x => x.user_id,
                        principalSchema: "expegraph",
                        principalTable: "users",
                        principalColumn: "user_id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "resistors",
                schema: "expegraph",
                columns: table => new
                {
                    resistor_id = table.Column<int>(type: "integer", nullable: false),
                    geometry_type = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    width_um = table.Column<float>(type: "real", nullable: true),
                    gap_um = table.Column<float>(type: "real", nullable: true),
                    inner_radius_um = table.Column<float>(type: "real", nullable: true),
                    outer_radius_um = table.Column<float>(type: "real", nullable: true),
                    geometry_properties = table.Column<Dictionary<string, object>>(type: "jsonb", nullable: true),
                    resistance_ohm = table.Column<float>(type: "real", nullable: true),
                    tlm_id = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_resistors", x => x.resistor_id);
                    table.CheckConstraint("CK_resistors_geometry_type", "geometry_type IN ('rectangular', 'circular', 'other')");
                    table.ForeignKey(
                        name: "FK_resistors_devices_resistor_id",
                        column: x => x.resistor_id,
                        principalSchema: "expegraph",
                        principalTable: "devices",
                        principalColumn: "device_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_resistors_tlms_tlm_id",
                        column: x => x.tlm_id,
                        principalSchema: "expegraph",
                        principalTable: "tlms",
                        principalColumn: "tlm_id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "transistors",
                schema: "expegraph",
                columns: table => new
                {
                    transistor_id = table.Column<int>(type: "integer", nullable: false),
                    geometry_type = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    gate_width_um = table.Column<float>(type: "real", nullable: true),
                    gate_length_um = table.Column<float>(type: "real", nullable: true),
                    gate_inner_radius_um = table.Column<float>(type: "real", nullable: true),
                    gate_outer_radius_um = table.Column<float>(type: "real", nullable: true),
                    coverage_sector_degree = table.Column<float>(type: "real", nullable: true),
                    geometry_properties = table.Column<Dictionary<string, object>>(type: "jsonb", nullable: true),
                    mobility_cm2_vs = table.Column<float>(type: "real", nullable: true),
                    on_off_ratio = table.Column<float>(type: "real", nullable: true),
                    threshold_voltage_v = table.Column<float>(type: "real", nullable: true),
                    subthreshold_swing_mv_dec = table.Column<float>(type: "real", nullable: true),
                    sg_gap_um = table.Column<float>(type: "real", nullable: true),
                    dg_gap_um = table.Column<float>(type: "real", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_transistors", x => x.transistor_id);
                    table.CheckConstraint("CK_transistors_geometry_type", "geometry_type IN ('rectangular', 'circular', 'other')");
                    table.ForeignKey(
                        name: "FK_transistors_devices_transistor_id",
                        column: x => x.transistor_id,
                        principalSchema: "expegraph",
                        principalTable: "devices",
                        principalColumn: "device_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_batches_batch_name",
                schema: "expegraph",
                table: "batches",
                column: "batch_name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_batches_lab_id",
                schema: "expegraph",
                table: "batches",
                column: "lab_id");

            migrationBuilder.CreateIndex(
                name: "IX_batches_project_id",
                schema: "expegraph",
                table: "batches",
                column: "project_id");

            migrationBuilder.CreateIndex(
                name: "IX_device_parameters_device_id_key",
                schema: "expegraph",
                table: "device_parameters",
                columns: new[] { "device_id", "key" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_devices_sample_id",
                schema: "expegraph",
                table: "devices",
                column: "sample_id");

            migrationBuilder.CreateIndex(
                name: "IX_equipment_serial_number",
                schema: "expegraph",
                table: "equipment",
                column: "serial_number",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_labs_lab_leader_id",
                schema: "expegraph",
                table: "labs",
                column: "lab_leader_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_labs_lab_name",
                schema: "expegraph",
                table: "labs",
                column: "lab_name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_labs_equipment_equipment_id",
                schema: "expegraph",
                table: "labs_equipment",
                column: "equipment_id");

            migrationBuilder.CreateIndex(
                name: "IX_labs_projects_project_id",
                schema: "expegraph",
                table: "labs_projects",
                column: "project_id");

            migrationBuilder.CreateIndex(
                name: "IX_measurements_device_id",
                schema: "expegraph",
                table: "measurements",
                column: "device_id");

            migrationBuilder.CreateIndex(
                name: "IX_measurements_equipment_id",
                schema: "expegraph",
                table: "measurements",
                column: "equipment_id");

            migrationBuilder.CreateIndex(
                name: "IX_measurements_measured_at",
                schema: "expegraph",
                table: "measurements",
                column: "measured_at");

            migrationBuilder.CreateIndex(
                name: "IX_measurements_sample_id",
                schema: "expegraph",
                table: "measurements",
                column: "sample_id");

            migrationBuilder.CreateIndex(
                name: "IX_measurements_user_id",
                schema: "expegraph",
                table: "measurements",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_permissions_permission_name",
                schema: "expegraph",
                table: "permissions",
                column: "permission_name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_resistors_tlm_id",
                schema: "expegraph",
                table: "resistors",
                column: "tlm_id");

            migrationBuilder.CreateIndex(
                name: "IX_roles_role_name",
                schema: "expegraph",
                table: "roles",
                column: "role_name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_roles_permissions_permission_id",
                schema: "expegraph",
                table: "roles_permissions",
                column: "permission_id");

            migrationBuilder.CreateIndex(
                name: "IX_samples_batch_id",
                schema: "expegraph",
                table: "samples",
                column: "batch_id");

            migrationBuilder.CreateIndex(
                name: "IX_users_email",
                schema: "expegraph",
                table: "users",
                column: "email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_users_username",
                schema: "expegraph",
                table: "users",
                column: "username",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_users_labs_lab_id",
                schema: "expegraph",
                table: "users_labs",
                column: "lab_id");

            migrationBuilder.CreateIndex(
                name: "IX_users_projects_project_id",
                schema: "expegraph",
                table: "users_projects",
                column: "project_id");

            migrationBuilder.CreateIndex(
                name: "IX_users_roles_role_id",
                schema: "expegraph",
                table: "users_roles",
                column: "role_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "device_parameters",
                schema: "expegraph");

            migrationBuilder.DropTable(
                name: "diodes",
                schema: "expegraph");

            migrationBuilder.DropTable(
                name: "labs_equipment",
                schema: "expegraph");

            migrationBuilder.DropTable(
                name: "labs_projects",
                schema: "expegraph");

            migrationBuilder.DropTable(
                name: "measurements",
                schema: "expegraph");

            migrationBuilder.DropTable(
                name: "resistors",
                schema: "expegraph");

            migrationBuilder.DropTable(
                name: "roles_permissions",
                schema: "expegraph");

            migrationBuilder.DropTable(
                name: "transistors",
                schema: "expegraph");

            migrationBuilder.DropTable(
                name: "users_labs",
                schema: "expegraph");

            migrationBuilder.DropTable(
                name: "users_projects",
                schema: "expegraph");

            migrationBuilder.DropTable(
                name: "users_roles",
                schema: "expegraph");

            migrationBuilder.DropTable(
                name: "equipment",
                schema: "expegraph");

            migrationBuilder.DropTable(
                name: "tlms",
                schema: "expegraph");

            migrationBuilder.DropTable(
                name: "permissions",
                schema: "expegraph");

            migrationBuilder.DropTable(
                name: "devices",
                schema: "expegraph");

            migrationBuilder.DropTable(
                name: "roles",
                schema: "expegraph");

            migrationBuilder.DropTable(
                name: "samples",
                schema: "expegraph");

            migrationBuilder.DropTable(
                name: "batches",
                schema: "expegraph");

            migrationBuilder.DropTable(
                name: "labs",
                schema: "expegraph");

            migrationBuilder.DropTable(
                name: "projects",
                schema: "expegraph");

            migrationBuilder.DropTable(
                name: "users",
                schema: "expegraph");
        }
    }
}
