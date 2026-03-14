namespace DataManagement.Models;
public class Lab
{
    public int LabId { get; set;}
    public string LabName { get; set;} = string.Empty;
    public string? Description { get; set;}
    public int? LabLeaderId { get; set; }
    public DateTime CreatedAt { get; set;}
    public ICollection<UserLab>? UserLabs { get; set; }
}