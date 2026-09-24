using System.Security.Cryptography.X509Certificates;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace DataManagement.Dtos;

public record DeviceParameterResponse(
    int DeviceParameterId, 
    int DeviceId, 
    string Key, 
    string? Value);
public record CreateDeviceParameterRequest(
    int DeviceId, 
    string Key, 
    string? Value);
public record UpdateDeviceParameterRequest(
    string? Value
);
public record DeviceParameterQuery
{
    public string? SearchTxt { get; init;}
    public int? MinId { get; init;}
    public int? MaxId { get; init;}
    public int? DeviceId { get; init; }
};