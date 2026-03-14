namespace DataManagement.Dtos;

public record UserRoleResponse(int UserId, int RoleId, DateOnly? RoleStartDate, DateOnly? RoleEndDate);
public record CreateUserRoleRequest(int UserId, int RoleId, DateOnly? RoleStartDate = null, DateOnly? RoleEndDate = null);
public record UpdateUserRoleRequest(DateOnly? RoleStartDate, DateOnly? RoleEndDate);