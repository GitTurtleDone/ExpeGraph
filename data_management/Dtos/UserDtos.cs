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

public record UserQuery(
    string? Search,
    int? MinId,
    int? MaxId,
    bool? IsActive,
    DateTime? LastLoginFrom,
    DateTime? LastLoginTo
);

public record DiodeResponse(
    int DiodeId,
    string GeometryType,
    float? AnodeWidthUm,
    float? AnodeLengthUm,
    float? ChamferRadiusUm,
    float? AnodeRadiusUm,
    Dictionary<string, object>? GeometryProperties,
    float? BarrierHeightEv,
    float? IdealityFactor,
    float? RecRatio,
    float? BuiltInPotentialV,
    double? CarrierConcentration,
    float? MaxCurrentA,
    float? VoltageAtMaxCurrentV,
    float? BreakdownVoltageV);