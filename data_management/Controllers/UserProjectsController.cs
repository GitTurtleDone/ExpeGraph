using DataManagement.Data;
using DataManagement.Models;
using DataManagement.Dtos;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;

namespace DataManagement.Controllers;

[ApiController]
[Route("[controller]")]
public class UserProjectsController : ControllerBase
{
    private readonly AppDbContext _db;
    public UserProjectsController(AppDbContext db)
    {
        _db = db;
    }

    // GET userprojects/
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] UserProjectQuery q)
    {
        var query = _db.UserProjects.AsNoTracking();
        if (q.UserId is not null) query = query.Where(up => up.UserId == q.UserId);
        if (q.ProjectId is not null) query = query.Where(up => up.ProjectId == q.ProjectId);
        if (q.Role is not null) query = query.Where(up => up.Role == q.Role);
        if (q.JoinedAtFrom is not null) query = query.Where(up => up.JoinedAt >= q.JoinedAtFrom);
        if (q.JoinedAtTo is not null) query = query.Where(up => up.JoinedAt <= q.JoinedAtTo);
        query = query.OrderBy(up => up.UserId);
        return Ok(await query
                .Select(up => new UserProjectResponse(
                    up.UserId, up.ProjectId, up.Role, up.JoinedAt
                ))
                .ToListAsync());
    }
    // Ok(await _db.UserProjects
    //             .Select(up => new UserProjectResponse(
    //                 up.UserId,
    //                 up.ProjectId,
    //                 up.Role,
    //                 up.JoinedAt))
    //             .ToListAsync());

    // GET userprojects/{userId}/{projectId}
    [HttpGet("{userId:int}/{projectId:int}")]
    public async Task<IActionResult> GetById(int userId, int projectId)
    {
        var userProject = await _db.UserProjects.FindAsync(userId, projectId);
        return userProject is null
            ? NotFound($"User {userId} is not assigned to project {projectId}.")
            : Ok(new UserProjectResponse(userProject.UserId, userProject.ProjectId,
                    userProject.Role, userProject.JoinedAt));
    }

    // POST userprojects/
    [HttpPost]
    public async Task<IActionResult> Create(CreateUserProjectRequest req)
    {
        if (!await _db.Users.AnyAsync(u => u.UserId == req.UserId))
            return NotFound($"User with id {req.UserId} does not exist.");
        if (!await _db.Projects.AnyAsync(p => p.ProjectId == req.ProjectId))
            return NotFound($"Project with id {req.ProjectId} does not exist.");

        var userProject = new UserProject
        {
            UserId = req.UserId,
            ProjectId = req.ProjectId,
            Role = req.Role
        };
        _db.UserProjects.Add(userProject);
        try
        {
            await _db.SaveChangesAsync();
        }
        catch (DbUpdateException ex) when (ex.InnerException?.Message.Contains("23505") == true)
        {
            return Conflict($"User {req.UserId} is already assigned to project {req.ProjectId}.");
        }
        catch (DbUpdateException ex)
        {
            return StatusCode(500, $"An error occurred while saving data: {ex.Message}");
        }
        return CreatedAtAction(nameof(GetById),
            new { userId = userProject.UserId, projectId = userProject.ProjectId },
            new UserProjectResponse(userProject.UserId, userProject.ProjectId,
                userProject.Role, userProject.JoinedAt));
    }

    // PUT userprojects/{userId}/{projectId}
    [HttpPut("{userId:int}/{projectId:int}")]
    public async Task<IActionResult> Update(int userId, int projectId, UpdateUserProjectRequest req)
    {
        if (!await _db.Users.AnyAsync(u => u.UserId == userId))
            return NotFound($"User with id {userId} does not exist.");
        if (!await _db.Projects.AnyAsync(p => p.ProjectId == projectId))
            return NotFound($"Project with id {projectId} does not exist.");

        var userProject = await _db.UserProjects.FindAsync(userId, projectId);
        if (userProject is null)
            return NotFound($"User {userId} is not assigned to project {projectId}.");

        userProject.Role = req.Role;
        try
        {
            await _db.SaveChangesAsync();
        }
        catch (DbUpdateException ex)
        {
            return StatusCode(500, $"An error occurred while saving data: {ex.Message}");
        }
        return Ok(new UserProjectResponse(userProject.UserId, userProject.ProjectId,
            userProject.Role, userProject.JoinedAt));
    }

    // DELETE userprojects/{userId}/{projectId}
    [HttpDelete("{userId:int}/{projectId:int}")]
    public async Task<IActionResult> Delete(int userId, int projectId)
    {
        if (!await _db.Users.AnyAsync(u => u.UserId == userId))
            return NotFound($"User with id {userId} does not exist.");
        if (!await _db.Projects.AnyAsync(p => p.ProjectId == projectId))
            return NotFound($"Project with id {projectId} does not exist.");

        var userProject = await _db.UserProjects.FindAsync(userId, projectId);
        if (userProject is null)
            return NotFound($"User {userId} is not assigned to project {projectId}.");

        _db.UserProjects.Remove(userProject);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
