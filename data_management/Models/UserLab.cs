namespace DataManagement.Models;

public class UserLab
{
    public int UserId { get; set; }
    public int LabId { get; set; }
    public string Role { get; set; } = "member";
    public DateTime JoinedAt { get; set; }

    // Navigation properties
    public User User { get; set; } = null!;
    public Lab Lab { get; set; } = null!;
}
