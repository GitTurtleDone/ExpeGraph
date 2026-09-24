namespace DataManagement.Dtos;
public record LabResponse
(
    int LabId,
    string LabName,
    string? Description,
    int? LabLeaderId,
    DateTime CreatedAt
);

public record CreateLabRequest
(
    string LabName,
    string? Description,
    int? LabLeaderId
);

public record UpdateLabRequest
(
    string LabName,
    string? Description,
    int? LabLeaderId
);

public record LabQuery
{
    public string? SearchTxt { get; init;}
    public int? MinId { get; init;}
    public int? MaxId { get; init;}
    public int? LabLeaderId { get; init;}

};