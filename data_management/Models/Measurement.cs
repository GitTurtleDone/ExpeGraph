namespace DataManagement.Models;
public class Measurement
{
	public int MeasurementId { get; set;}
	public int? DeviceId { get; set;}
	public int? SampleId { get; set;}
	public int? EquipmentId { get; set;}
	public int? UserId { get; set;}
	public string MeasurementType { get; set;} = string.Empty;
	public DateTime MeasuredAt { get; set;}
	public float? TemperatureK { get; set;}
	public float? HumidityPercent { get; set;}
	public string? Notes { get; set;}
	public string DataFilePath { get; set;} = string.Empty;
}