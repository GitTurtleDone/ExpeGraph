namespace DataManagement.Models;

public class Permission
{
    public int PermissionId { get; set; }
    public string PermissionName { get; set; } = string.Empty;
    public string? Description { get; set; }
    public ICollection<RolePermission>? RolePermissions { get; set; }
}