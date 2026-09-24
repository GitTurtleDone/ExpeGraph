namespace DataManagement.Dtos;

public record UserRoleResponse
(
    int UserId, 
    int RoleId, 
    DateOnly? RoleStartDate, 
    DateOnly? RoleEndDate
);
public record CreateUserRoleRequest
(
    int UserId, 
    int RoleId, 
    DateOnly? RoleStartDate = null, 
    DateOnly? RoleEndDate = null
);
public record UpdateUserRoleRequest(DateOnly? RoleStartDate, DateOnly? RoleEndDate);

public record UserRoleQuery
{	
    public int? UserId { get; init;}
    public int? RoleId { get; init;}
    public DateOnly? RoleStartDateFrom { get; init;}
    public DateOnly? RoleStartDateTo { get; init;}
    public DateOnly? RoleEndDateFrom { get; init;}
    public DateOnly? RoleEndDateTo { get; init;}
};