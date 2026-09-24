namespace DataManagement.Dtos;

public record UserResponse
(
    int UserId,
    string Username,
    string Email,
    string? FirstName,
    string? LastName,
    bool IsActive,
    DateTime CreatedAt,
    DateTime? LastLoginAt
);

public record CreateUserRequest
(
    string Username,
    string Email,
    string Password,
    string? FirstName,
    string? LastName);

public record UpdateUserRequest
(
    string Username,
    string Email,
    string? Password,
    string? FirstName,
    string? LastName,
    bool IsActive
);

public record UserQuery
{	
	public string? SearchTxt { get; init;}
    public int? MinId { get; init;}
    public int? MaxId { get; init;}
    public bool? IsActive { get; init;}
    public DateTime? LastLoginFrom { get; init;}
    public DateTime? LastLoginTo { get; init;}
};