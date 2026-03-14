using DataManagement.Data;
using DataManagement.Dtos;
using DataManagement.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DataManagement.Controllers;

[ApiController]
[Route("[controller]")]
public class UsersRolesController : ControllerBase
{
    private readonly AppDbContext _db;
    public UsersRolesController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult> GetAll() =>
        Ok(await _db.UserRoles.Select(ur => new UserRoleResponse(ur.UserId, ur.RoleId, ur.RoleStartDate, ur.RoleEndDate)).ToListAsync());

    [HttpGet("{userId:int}/{roleId:int}")]
    public async Task<ActionResult> GetById(int userId, int roleId)
    {
        var ur = await _db.UserRoles.FindAsync(userId, roleId);
        return ur is null
            ? NotFound($"User {userId} does not have role {roleId}.")
            : Ok(new UserRoleResponse(ur.UserId, ur.RoleId, ur.RoleStartDate, ur.RoleEndDate));
    }

    [HttpPost]
    public async Task<ActionResult> Create(CreateUserRoleRequest req)
    {
        var ur = new UserRole
        {
            UserId = req.UserId, RoleId = req.RoleId,
            RoleStartDate = req.RoleStartDate, RoleEndDate = req.RoleEndDate
        };
        _db.UserRoles.Add(ur);
        try { await _db.SaveChangesAsync(); }
        catch (DbUpdateException ex) when (ex.InnerException?.Message.Contains("23503") == true)
        {
            return NotFound($"User {req.UserId} or role {req.RoleId} does not exist.");
        }
        catch (DbUpdateException ex) when (ex.InnerException?.Message.Contains("23505") == true)
        {
            return Conflict($"User {req.UserId} already has role {req.RoleId}.");
        }
        return CreatedAtAction(nameof(GetById), new { userId = ur.UserId, roleId = ur.RoleId },
            new UserRoleResponse(ur.UserId, ur.RoleId, ur.RoleStartDate, ur.RoleEndDate));
    }

    [HttpPut("{userId:int}/{roleId:int}")]
    public async Task<ActionResult> Update(int userId, int roleId, UpdateUserRoleRequest req)
    {
        var ur = await _db.UserRoles.FindAsync(userId, roleId);
        if (ur is null) return NotFound($"User {userId} does not have role {roleId}.");
        ur.RoleStartDate = req.RoleStartDate;
        ur.RoleEndDate = req.RoleEndDate;
        await _db.SaveChangesAsync();
        return Ok(new UserRoleResponse(ur.UserId, ur.RoleId, ur.RoleStartDate, ur.RoleEndDate));
    }

    [HttpDelete("{userId:int}/{roleId:int}")]
    public async Task<ActionResult> Delete(int userId, int roleId)
    {
        var ur = await _db.UserRoles.FindAsync(userId, roleId);
        if (ur is null) return NotFound($"User {userId} does not have role {roleId}.");
        _db.UserRoles.Remove(ur);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}