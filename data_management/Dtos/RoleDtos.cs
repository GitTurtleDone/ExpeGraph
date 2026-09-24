namespace DataManagement.Dtos;

public record RoleResponse
(
    int RoleId, 
    string RoleName, 
    string? Description
);
public record CreateRoleRequest
(
    string RoleName, 
    string? Description
);
public record UpdateRoleRequest
(
    string RoleName, 
    string? Description
);

public record RoleQuery
{	
	public string? SearchTxt { get; init;}
    public int? MinId { get; init;}
    public int? MaxId { get; init;}
};