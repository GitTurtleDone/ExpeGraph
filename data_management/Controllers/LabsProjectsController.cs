using DataManagement.Data;
using DataManagement.Dtos;
using DataManagement.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DataManagement.Controllers;

[ApiController]
[Route("[controller]")]
public class LabsProjectsController : ControllerBase
{
    private readonly AppDbContext _db;
    public LabsProjectsController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult> GetAll() =>
        Ok(await _db.LabProjects.Select(lp => new LabProjectResponse(lp.LabId, lp.ProjectId)).ToListAsync());

    [HttpGet("{labId:int}/{projectId:int}")]
    public async Task<ActionResult> GetById(int labId, int projectId)
    {
        var lp = await _db.LabProjects.FindAsync(labId, projectId);
        return lp is null
            ? NotFound($"Lab {labId} is not associated with project {projectId}.")
            : Ok(new LabProjectResponse(lp.LabId, lp.ProjectId));
    }

    [HttpPost]
    public async Task<ActionResult> Create(CreateLabProjectRequest req)
    {
        var lp = new LabProject { LabId = req.LabId, ProjectId = req.ProjectId };
        _db.LabProjects.Add(lp);
        try { await _db.SaveChangesAsync(); }
        catch (DbUpdateException ex) when (ex.InnerException?.Message.Contains("23503") == true)
        {
            return NotFound($"Lab {req.LabId} or project {req.ProjectId} does not exist.");
        }
        catch (DbUpdateException ex) when (ex.InnerException?.Message.Contains("23505") == true)
        {
            return Conflict($"Lab {req.LabId} is already associated with project {req.ProjectId}.");
        }
        return CreatedAtAction(nameof(GetById), new { labId = lp.LabId, projectId = lp.ProjectId },
            new LabProjectResponse(lp.LabId, lp.ProjectId));
    }

    [HttpDelete("{labId:int}/{projectId:int}")]
    public async Task<ActionResult> Delete(int labId, int projectId)
    {
        var lp = await _db.LabProjects.FindAsync(labId, projectId);
        if (lp is null) return NotFound($"Lab {labId} is not associated with project {projectId}.");
        _db.LabProjects.Remove(lp);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}