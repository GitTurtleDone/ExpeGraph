namespace DataManagement.Dtos;

public record DeviceResponse(	
	int DeviceId,
	string DeviceName,
	string DeviceType,
	int SampleId);
public record CreateDeviceRequest( 
	string DeviceName,
	string DeviceType,
	int SampleId);
public record UpdateDeviceRequest(
	string DeviceName,
	string DeviceType,
	int SampleId);