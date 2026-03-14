namespace DataManagement.Dtos;

public record DeviceParameterResponse(int DeviceParameterId, int DeviceId, string Key, string? Value);
public record CreateDeviceParameterRequest(int DeviceId, string Key, string? Value);
public record UpdateDeviceParameterRequest(string? Value);