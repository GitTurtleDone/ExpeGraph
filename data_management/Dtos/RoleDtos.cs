namespace DataManagement.Dtos;

public record RoleResponse(int RoleId, string RoleName, string? Description);
public record CreateRoleRequest(string RoleName, string? Description);
public record UpdateRoleRequest(string RoleName, string? Description);