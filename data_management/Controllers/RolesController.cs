using DataManagement.Data;
using DataManagement.Dtos;
using DataManagement.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DataManagement.Controllers;

[ApiController]
[Route("[controller]")]
public class RolesController : ControllerBase
{
    private readonly AppDbContext _db;
    public RolesController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult> GetAll() =>
        Ok(await _db.Roles.Select(r => new RoleResponse(r.RoleId, r.RoleName, r.Description)).ToListAsync());

    [HttpGet("{id}")]
    public async Task<ActionResult> GetById(int id)
    {
        var role = await _db.Roles.FindAsync(id);
        return role is null
            ? NotFound($"Role with id {id} not found.")
            : Ok(new RoleResponse(role.RoleId, role.RoleName, role.Description));
    }

    [HttpPost]
    public async Task<ActionResult> Create(CreateRoleRequest req)
    {
        var role = new Role { RoleName = req.RoleName, Description = req.Description };
        _db.Roles.Add(role);
        try { await _db.SaveChangesAsync(); }
        catch (DbUpdateException ex) when (ex.InnerException?.Message.Contains("23505") == true)
        {
            return Conflict($"Role '{req.RoleName}' already exists.");
        }
        return CreatedAtAction(nameof(GetById), new { id = role.RoleId },
            new RoleResponse(role.RoleId, role.RoleName, role.Description));
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> Update(int id, UpdateRoleRequest req)
    {
        var role = await _db.Roles.FindAsync(id);
        if (role is null) return NotFound($"Role with id {id} not found.");
        role.RoleName = req.RoleName;
        role.Description = req.Description;
        try { await _db.SaveChangesAsync(); }
        catch (DbUpdateException ex) when (ex.InnerException?.Message.Contains("23505") == true)
        {
            return Conflict($"Role '{req.RoleName}' already exists.");
        }
        return Ok(new RoleResponse(role.RoleId, role.RoleName, role.Description));
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
        var role = await _db.Roles.FindAsync(id);
        if (role is null) return NotFound($"Role with id {id} not found.");
        _db.Roles.Remove(role);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}