namespace DataManagement.Dtos;

public record RolePermissionResponse(int RoleId, int PermissionId);
public record CreateRolePermissionRequest(int RoleId, int PermissionId);