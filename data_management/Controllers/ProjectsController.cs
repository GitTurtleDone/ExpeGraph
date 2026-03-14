using DataManagement.Data;
using DataManagement.Dtos;
using DataManagement.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DataManagement.Controllers;

[ApiController]
[Route("[controller]")]
public class ProjectsController : ControllerBase
{
	private readonly AppDbContext _db;
	public ProjectsController(AppDbContext db)
	{
		_db = db;
	}
	//GET projects/
	[HttpGet]
	public async Task<IActionResult> GetAll() =>
        Ok(await _db.Projects
                .Select(p => new ProjectResponse(
                    p.ProjectId, p.ProjectName, p.Description, p.Funding,
                    p.StartDate, p.EndDate, p.CreatedAt))
                .ToListAsync());
	
	//GET projects/id
	[HttpGet("{id:int}")]
	public async Task<IActionResult> GetById(int id)
	{
		var project = await _db.Projects.FindAsync(id);
		return project is null
		       ? NotFound($"Project with id {id} is not found")
		       : Ok(new ProjectResponse(
			    project.ProjectId, project.ProjectName, project.Description, project.Funding,
			    project.StartDate, project.EndDate, project.CreatedAt));
	}
	
	//POST projects/
	[HttpPost]
	public async Task<IActionResult> Create(CreateProjectRequest req)
	{	
		var project = new Project{
			ProjectName = req.ProjectName,
			Description = req.Description,
			Funding = req.Funding,
			StartDate = req.StartDate,
			EndDate = req.EndDate
		}; 
		_db.Projects.Add(project);
		try 
		{
			await _db.SaveChangesAsync();
		}
		catch (DbUpdateException ex)
		{
			return StatusCode(500, $"An error occurred while saving data: {ex.Message}");
		};
		return CreatedAtAction(nameof(GetById), new { id = project.ProjectId}, new ProjectResponse(
					project.ProjectId, project.ProjectName, project.Description, project.Funding,
					project.StartDate, project.EndDate, project.CreatedAt));
	}
	
	//PUT projects/id
	[HttpPut("{id:int}")]
	public async Task<IActionResult> Update(int id, UpdateProjectRequest req)
	{
		var project = await _db.Projects.FindAsync(id);
		if (project is null) return NotFound($"Project with id {id} is not found");
		project.ProjectName = req.ProjectName;
		project.Description = req.Description;		
		project.Funding = req.Funding;
		project.StartDate = req.StartDate;
		project.EndDate = req.EndDate;
		try 
		{
			await _db.SaveChangesAsync();
		}
		catch (DbUpdateException ex)
		{
			return StatusCode(500, $"An error occurred while saving data: {ex.Message}");
		};
		return Ok(new ProjectResponse(
				project.ProjectId, project.ProjectName, project.Description, project.Funding,
				project.StartDate, project.EndDate, project.CreatedAt));
	}
	
	//DELETE projects/id
    [HttpDelete("{id:int}")]
	public async Task<IActionResult> Delete(int id)
	{
		var project = await _db.Projects.FindAsync(id);
		if (project is null) return NotFound($"Project with id {id} is not found");
		_db.Projects.Remove(project);
        await _db.SaveChangesAsync();
		return NoContent();
	}
}



