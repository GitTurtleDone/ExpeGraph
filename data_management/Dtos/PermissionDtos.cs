namespace DataManagement.Dtos;

public record PermissionResponse(int PermissionId, string PermissionName, string? Description);
public record CreatePermissionRequest(string PermissionName, string? Description);
public record UpdatePermissionRequest(string PermissionName, string? Description);