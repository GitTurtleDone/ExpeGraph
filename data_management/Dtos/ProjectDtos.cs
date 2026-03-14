namespace DataManagement.Dtos;

public record ProjectResponse(
	int ProjectId,
	string ProjectName,
	string? Description,
	string? Funding,
	DateOnly? StartDate,
	DateOnly? EndDate,
	DateTime CreatedAt);

public record CreateProjectRequest(
	string ProjectName,
	string? Description,
	string? Funding,
	DateOnly? StartDate,
	DateOnly? EndDate);

public record UpdateProjectRequest(
	string ProjectName,
	string? Description,
	string? Funding,
	DateOnly? StartDate,
	DateOnly? EndDate);