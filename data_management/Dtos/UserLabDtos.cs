namespace DataManagement.Dtos;

public record UserLabResponse(
    int UserId,
    int LabId,
    string Role,
    DateTime JoinedAt);

public record CreateUserLabRequest(
    int UserId,
    int LabId,
    string Role);

public record UpdateUserLabRequest(
    string Role);