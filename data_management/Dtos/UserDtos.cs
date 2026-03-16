namespace DataManagement.Dtos;

public record UserResponse(
    int UserId,
    string Username,
    string Email,
    string? FirstName,
    string? LastName,
    bool IsActive,
    DateTime CreatedAt,
    DateTime? LastLoginAt);

public record CreateUserRequest(
    string Username,
    string Email,
    string Password,
    string? FirstName,
    string? LastName);

public record UpdateUserRequest(
    string Username,
    string Email,
    string? Password,
    string? FirstName,
    string? LastName,
    bool IsActive);