namespace DataManagement.Models;
public class User
{
    public int UserId { get; set;}
    public string Username { get; set;} = string.Empty;
    public string Email { get; set;} = string.Empty;
    public string PasswordHash { get; set;} = string.Empty;
    public string? FirstName { get; set;}
    public string? LastName { get; set;}
    public bool IsActive { get; set;}
    public DateTime CreatedAt { get; set;}
    public DateTime LastLoginAt { get; set;}
    public ICollection<UserProject>? UserProjects { get; set; }
    public ICollection<UserLab>? UserLabs { get; set; }
    public ICollection<UserRole>? UserRoles { get; set; }
}