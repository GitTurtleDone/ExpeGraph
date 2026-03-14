using DataManagement.Data;
using DataManagement.Dtos;
using DataManagement.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DataManagement.Controllers;

[ApiController]
[Route("[controller]")]

public class UserLabsController : ControllerBase
{
    private readonly AppDbContext _db;
    public UserLabsController(AppDbContext db)
    {
        _db = db;
    }
    //GET userlabs/
    [HttpGet]
    public async Task<ActionResult> GetAll() =>
        Ok(await _db.UserLabs
                .Select(ul => new UserLabResponse(
                    ul.UserId, ul.LabId, ul.Role, ul.JoinedAt))
                .ToListAsync());
    //GET userlabs/{userId}/{LabId}
    [HttpGet("{userId:int}/{labId:int}")]
    public async Task<ActionResult> GetById(int userId, int labId)
    {
        var userLab = await _db.UserLabs.FindAsync(userId, labId); 
        return userLab is null
                ? NotFound($"User with id {userId} does not belong to lab with id {labId}")
                : Ok(new UserLabResponse(userLab.UserId, userLab.LabId, userLab.Role, userLab.JoinedAt));
    }
    //POST userlabs/
    [HttpPost]
    public async Task<ActionResult> Create(CreateUserLabRequest req)
    {   
        var userLab = new UserLab
        {
            UserId = req.UserId,
            LabId = req.LabId,
            Role = req.Role
        };
        _db.UserLabs.Add(userLab);
        try
        {
            await _db.SaveChangesAsync();
        }
        catch (DbUpdateException ex) when (ex.InnerException?.Message.Contains("23503") == true)
        {
            return NotFound($"User {req.UserId} or lab {req.LabId} does not exist.");
        }
        catch (DbUpdateException ex) when (ex.InnerException?.Message.Contains("23505") == true)
        {
            return Conflict($"User {req.UserId} already belongs to lab {req.LabId}.");
        }
        return CreatedAtAction(nameof(GetById), new { userId = userLab.UserId, labId = userLab.LabId }, 
            new UserLabResponse(userLab.UserId, userLab.LabId, userLab.Role, userLab.JoinedAt));
    }
    
    private static readonly string[] AllowedRoles = ["leader", "deputy_leader", "member", "student"];
    //PUT userlabs/{userId}/{labId}
    [HttpPut("{userId:int}/{labId:int}")]
    public async Task<ActionResult> Update(int userId, int labId, UpdateUserLabRequest req)
    {
        if (!AllowedRoles.Contains(req.Role))
            return BadRequest($"Role must be one of: {string.Join(", ", AllowedRoles)}.");

        var userLab = await _db.UserLabs.FindAsync(userId, labId);
        if (userLab is null)
            return NotFound($"User {userId} does not belong to lab {labId}.");
        
        userLab.Role = req.Role;
        await _db.SaveChangesAsync();
        return Ok(new UserLabResponse(userLab.UserId, userLab.LabId, userLab.Role, userLab.JoinedAt));
    }

    //DELETE userlabs/{userId}/{labId}
    [HttpDelete("{userId:int}/{labId:int}")]
    public async Task<ActionResult> Delete(int userId, int labId)
    {
        var userLab = await _db.UserLabs.FindAsync(userId, labId);
        if (userLab is null)
            return NotFound($"User with id {userId} does not belong to lab with id {labId}");
        _db.UserLabs.Remove(userLab);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}