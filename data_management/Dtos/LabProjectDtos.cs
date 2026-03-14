namespace DataManagement.Dtos;

public record LabProjectResponse(int LabId, int ProjectId);
public record CreateLabProjectRequest(int LabId, int ProjectId);