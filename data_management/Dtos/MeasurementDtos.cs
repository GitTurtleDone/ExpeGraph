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

public record UpdateMeasurementRequest
(
	int? DeviceId,
	int? SampleId,
	int? EquipmentId,
	int? UserId,
	string MeasurementType,
    DateTime MeasuredAt,
	float? TemperatureK,
	float? HumidityPercent,
	string? Notes,
	string DataFilePath
);
public record MeasurementQuery
{	
    public int? MinId { get; init;}
    public int? MaxId { get; init;}
	public int? DeviceId { get; init;}
	public int? SampleId { get; init;}
	public int? EquipmentId { get; init;}
	public int? UserId { get; init;}
	public string? MeasurementType { get; init;}
	public DateTime? MeasuredAtFrom { get; init;}
	public DateTime? MeasuredAtTo { get; init;}
	public float? MinTemperatureK { get; init;}
	public float? MaxTemperatureK { get; init;}
	public float? MinHumidityPercent { get; init;}
	public float? MaxHumidityPercent { get; init;}
}