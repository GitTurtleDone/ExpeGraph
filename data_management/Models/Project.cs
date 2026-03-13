namespace DataManagement.Models;

public class Project
{
	public int ProjectId { get; set;}
	public string ProjectName { get; set;} = string.Empty;
	public string? Description { get; set;}
	public string? Funding { get; set;}
	public DateOnly? StartDate { get; set;}
	public DateOnly? EndDate { get; set;}
	public DateTime CreatedAt { get; set;}	
	public ICollection<UserProject>? UserProjects { get; set; }
}