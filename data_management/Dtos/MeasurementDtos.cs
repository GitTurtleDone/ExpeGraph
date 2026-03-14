namespace DataManagement.Dtos;

public record MeasurementResponse(
	int MeasurementId,
	int? DeviceId,
	int? SampleId,
	int? EquipmentId,
	int? UserId,
	string MeasurementType,
	DateTime MeasuredAt,
	float? TemperatureK,
	float? HumidityPercent,
	string? Notes,
	string DataFilePath);

public record CreateMeasurementRequest(
	int? DeviceId,
	int? SampleId,
	int? EquipmentId,
	int? UserId,
	string MeasurementType,
    DateTime MeasuredAt,
	float? TemperatureK,
	float? HumidityPercent,
	string? Notes,
	string DataFilePath);

public record UpdateMeasurementRequest(
	int? DeviceId,
	int? SampleId,
	int? EquipmentId,
	int? UserId,
	string MeasurementType,
    DateTime MeasuredAt,
	float? TemperatureK,
	float? HumidityPercent,
	string? Notes,
	string DataFilePath);