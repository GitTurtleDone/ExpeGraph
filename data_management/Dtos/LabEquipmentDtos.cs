namespace DataManagement.Dtos;

public record LabEquipmentResponse(int LabId, int EquipmentId);
public record CreateLabEquipmentRequest(int LabId, int EquipmentId);