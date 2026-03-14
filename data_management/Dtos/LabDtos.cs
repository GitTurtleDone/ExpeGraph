namespace DataManagement.Dtos;
public record LabResponse(

    int LabId,
    string LabName,
    string? Description,
    int? LabLeaderId,
    DateTime CreatedAt);

public record CreateLabRequest(
    string LabName,
    string? Description,
    int? LabLeaderId);

public record UpdateLabRequest(
    string LabName,
    string? Description,
    int? LabLeaderId);