namespace DataManagement.Dtos;

public record LabEquipmentResponse
(
    int LabId, 
    int EquipmentId
);
public record CreateLabEquipmentRequest
(
    int LabId, 
    int EquipmentId
);
public record LabEquipmentQuery
{
    public int? LabId { get; init;}
    public int? EquipmentId { get; init;}
}