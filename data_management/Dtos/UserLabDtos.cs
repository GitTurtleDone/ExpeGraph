namespace DataManagement.Dtos;

public record UserLabResponse
(
    int UserId,
    int LabId,
    string Role,
    DateTime JoinedAt
);

public record CreateUserLabRequest
(
    int UserId,
    int LabId,
    string Role = "member"
);

public record UpdateUserLabRequest(
    string Role);

public record UserLabQuery
{	
    public int? UserId { get; init;}
    public int? LabId { get; init;}
    public string? Role { get; init;}
    public DateTime? JoinedAtFrom { get; set;}
    public DateTime? JoinedAtTo { get; set;}
};