using System.Security.Cryptography.X509Certificates;

namespace DataManagement.Dtos;

public record DeviceResponse
(	
	int DeviceId,
	string DeviceName,
	string DeviceType,
	int SampleId
);
public record CreateDeviceRequest
( 
	string DeviceName,
	string DeviceType,
	int SampleId
);
public record UpdateDeviceRequest
(
	string DeviceName,
	string DeviceType,
	int SampleId
);

public record DeviceQuery 
{
	public string? SearchTxt { get; set;}
	public string? DeviceType { get; set;}
    public int? MinId { get; set;}
    public int? MaxId { get; set;}
	public int? SampleId { get; set;}
};