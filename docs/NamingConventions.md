# ExpeGraph Naming Conventions

Consistent naming across all project components reduces cognitive overhead
and prevents bugs caused by mismatched identifiers.

---

## PostgreSQL (Database)

| Element | Convention | Example |
|---------|-----------|---------|
| Schema | lowercase | `expegraph` |
| Tables | lowercase `snake_case`, **plural** | `batches`, `measurement_types`, `users_roles` |
| Columns | lowercase `snake_case` | `batch_id`, `fabrication_date`, `data_file_path` |
| Primary keys | `{singular_table}_id` | `batch_id`, `sample_id`, `equipment_id` |
| Foreign keys | same name as the PK they reference | `batch_id` in `samples` references `batch_id` in `batches` |
| Indices | `idx_{table}_{column(s)}` | `idx_samples_batch_id`, `idx_measurements_measured_at` |
| Junction tables | `{table_a}_{table_b}` alphabetically | `labs_projects`, `users_roles`, `roles_permissions` |
| Boolean columns | `is_` or `has_` prefix | `is_active`, `has_treatment` |
| Timestamp columns | `_at` suffix | `created_at`, `measured_at`, `last_login_at` |
| Units in column names | append unit abbreviation | `size_um`, `temperature_k`, `resistance_ohm`, `voltage_v` |

**Do not use** `camelCase`, `PascalCase`, or MySQL backtick quoting in PostgreSQL.

---

## C# / .NET (Module 2 — Backend API)

| Element | Convention | Example |
|---------|-----------|---------|
| Namespaces | `PascalCase` | `DotnetBE.Models`, `DotnetBE.Data` |
| Classes | `PascalCase`, **singular** | `Batch`, `Sample`, `MeasurementType` |
| EF Core PK properties | `{ClassName}Id` | `BatchId`, `SampleId`, `EquipmentId` |
| EF Core FK properties | same as PK they reference | `BatchId` in `Sample` |
| Navigation properties | `PascalCase`, singular or plural as appropriate | `Batch`, `ICollection<Sample> Samples` |
| Methods | `PascalCase` | `GetAllBatches()`, `CreateMeasurement()` |
| Local variables | `camelCase` | `batchId`, `newSample` |
| Private fields | `_camelCase` | `_context`, `_logger` |
| Interfaces | `I` prefix | `IBatchRepository`, `IMeasurementService` |
| API Controllers | `{Resource}Controller` | `BatchesController`, `MeasurementsController` |
| DTOs | `{Resource}{Action}Dto` | `BatchCreateDto`, `MeasurementResponseDto` |
| Async methods | `Async` suffix | `GetBatchByIdAsync()`, `SaveMeasurementAsync()` |

---

## TypeScript / React (Frontend)

| Element | Convention | Example |
|---------|-----------|---------|
| Files (components) | `PascalCase.tsx` | `BatchCard.tsx`, `NavBar.tsx` |
| Files (utilities, hooks) | `camelCase.ts` | `apiClient.ts`, `useBatches.ts` |
| React components | `PascalCase` | `BatchCard`, `MeasurementTable` |
| Props interfaces | `{Component}Props` | `BatchCardProps`, `NavBarProps` |
| TypeScript types/interfaces | `PascalCase` | `Batch`, `Measurement`, `ApiResponse<T>` |
| Variables and functions | `camelCase` | `batchId`, `fetchMeasurements` |
| Custom hooks | `use` prefix | `useBatches`, `useMeasurementForm` |
| API route constants | `SCREAMING_SNAKE_CASE` | `API_BASE_URL`, `BATCHES_ENDPOINT` |
| Event handlers | `handle` prefix | `handleSubmit`, `handleDelete` |
| Boolean state/props | `is` or `has` prefix | `isLoading`, `hasError` |

---

## REST API Endpoints (served by .NET)

| Convention | Example |
|-----------|---------|
| Resources: lowercase, plural, kebab-case | `/api/batches`, `/api/measurement-types` |
| Sub-resources follow hierarchy | `/api/batches/{id}/samples` |
| Actions on a resource use HTTP verbs, not URLs | `POST /api/measurements` not `/api/measurements/create` |
| Query params: camelCase | `?startDate=2026-01-01&deviceType=diode` |

| HTTP Verb | Use |
|-----------|-----|
| `GET` | Retrieve one or many |
| `POST` | Create a new resource |
| `PUT` | Replace a resource entirely |
| `PATCH` | Partial update |
| `DELETE` | Remove a resource |

---

## Python (Module 1 — Acquisition, Module 3 — Analysis)

| Element | Convention | Example |
|---------|-----------|---------|
| Files / modules | `snake_case.py` | `visa_controller.py`, `iv_plotter.py` |
| Functions | `snake_case` | `connect_instrument()`, `plot_iv_curve()` |
| Classes | `PascalCase` | `VisaController`, `IVPlotter` |
| Constants | `SCREAMING_SNAKE_CASE` | `DATA_ROOT`, `DEFAULT_TIMEOUT_S` |
| Private functions | `_` prefix | `_parse_csv_header()` |
| Variables | `snake_case` | `device_id`, `file_path` |

---

## File System (Data Files and Graphs)

```
{DATA_ROOT}/
  {BatchName}/
    {SampleName}/
      {DeviceName}/
        {MeasurementType}_{YYYYMMDD_HHMMSS}.csv      ← raw data
        {MeasurementType}_{YYYYMMDD_HHMMSS}_graph.tiff ← exported graph
```

Rules:
- Use **underscores**, not spaces or hyphens in file/folder names
- **No units or IDs in folder names** — names must be human-readable
- **Temperature in filename** when the same device is measured at multiple temperatures:
  `IV_300K_20260228_143200.csv`
- Store **relative paths** from `DATA_ROOT` in the database (`data_file_path` column)

---

## Git Branches

| Branch | Purpose |
|--------|---------|
| `main` | Stable, released code |
| `design` | Architecture and documentation work |
| `feature/{short-description}` | New features, e.g. `feature/batch-api` |
| `fix/{short-description}` | Bug fixes, e.g. `fix/measurement-cascade` |
