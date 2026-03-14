namespace DataManagement.Models;

public class UserRole
{
    public int UserId { get; set; }
    public int RoleId { get; set; }
    public DateOnly? RoleStartDate { get; set; }
    public DateOnly? RoleEndDate { get; set; }
    public User User { get; set; } = null!;
    public Role Role { get; set; } = null!;
}