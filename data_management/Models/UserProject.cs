namespace DataManagement.Models;

public class UserProject
{
    public int UserId { get; set; }
    public int ProjectId { get; set; }
    public string? Role { get; set; }
    public DateTime JoinedAt { get; set; }

    // Navigation properties
    public User User { get; set; } = null!;
    public Project Project { get; set; } = null!;
}
