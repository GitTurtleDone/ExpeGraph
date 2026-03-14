namespace DataManagement.Models;

public class DeviceParameter
{
    public int DeviceParameterId { get; set; }
    public int DeviceId { get; set; }
    public string Key { get; set; } = string.Empty;
    public string? Value { get; set; }
    public Device Device { get; set; } = null!;
}