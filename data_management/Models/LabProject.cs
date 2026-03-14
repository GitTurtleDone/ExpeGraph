namespace DataManagement.Models;

public class LabProject
{
    public int LabId { get; set; }
    public int ProjectId { get; set; }
    public Lab Lab { get; set; } = null!;
    public Project Project { get; set; } = null!;
}