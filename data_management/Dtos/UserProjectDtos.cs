namespace DataManagement.Dtos;

public record UserProjectResponse
(
    int UserId,
    int ProjectId,
    string? Role,
    DateTime JoinedAt
);

public record CreateUserProjectRequest
(
    int UserId,
    int ProjectId,
    string? Role
);

public record UpdateUserProjectRequest
(
    string? Role
);

public record UserProjectQuery
{	
    public int? UserId { get; init;}
    public int? ProjectId { get; init;}
    public string? Role { get; init;}
    public DateTime? JoinedAtFrom { get; init;}
    public DateTime? JoinedAtTo { get; init;}
};