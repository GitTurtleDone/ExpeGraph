namespace DataManagement.Dtos;

public record UserProjectResponse(
    int UserId,
    int ProjectId,
    string? Role,
    DateTime JoinedAt);

public record CreateUserProjectRequest(
    int UserId,
    int ProjectId,
    string? Role);

public record UpdateUserProjectRequest(
    string? Role);