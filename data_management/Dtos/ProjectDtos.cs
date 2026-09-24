namespace DataManagement.Dtos;

public record ProjectResponse
(
	int ProjectId,
	string ProjectName,
	string? Description,
	string? Funding,
	DateOnly? StartDate,
	DateOnly? EndDate,
	DateTime CreatedAt
);

public record CreateProjectRequest
(
	string ProjectName,
	string? Description,
	string? Funding,
	DateOnly? StartDate,
	DateOnly? EndDate
);
public record UpdateProjectRequest
(
	string ProjectName,
	string? Description,
	string? Funding,
	DateOnly? StartDate,
	DateOnly? EndDate
);

public record ProjectQuery
{	
	public string? SearchTxt { get; init;}
    public int? MinId { get; init;}
    public int? MaxId { get; init;}
	public DateOnly? StartDateFrom { get; init;}
	public DateOnly? StartDateTo { get; init;}
	public DateOnly? EndDateFrom { get; init;}
	public DateOnly? EndDateTo { get; init;}
};