namespace DataManagement.Dtos;

public record LabProjectResponse
(
    int LabId, 
    int ProjectId
);
public record CreateLabProjectRequest
(
    int LabId, 
    int ProjectId
);

public record LabProjectQuery
{
    public int? LabId { get; init;}
    public int? ProjectId { get; init;}
};