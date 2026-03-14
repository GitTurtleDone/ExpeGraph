using DataManagement.Data;
using DataManagement.Dtos;
using DataManagement.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DataManagement.Controllers;

[ApiController]
[Route("[controller]")]
public class PermissionsController : ControllerBase
{
    private readonly AppDbContext _db;
    public PermissionsController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult> GetAll() =>
        Ok(await _db.Permissions.Select(p => new PermissionResponse(p.PermissionId, p.PermissionName, p.Description)).ToListAsync());

    [HttpGet("{id}")]
    public async Task<ActionResult> GetById(int id)
    {
        var permission = await _db.Permissions.FindAsync(id);
        return permission is null
            ? NotFound($"Permission with id {id} not found.")
            : Ok(new PermissionResponse(permission.PermissionId, permission.PermissionName, permission.Description));
    }

    [HttpPost]
    public async Task<ActionResult> Create(CreatePermissionRequest req)
    {
        var permission = new Permission { PermissionName = req.PermissionName, Description = req.Description };
        _db.Permissions.Add(permission);
        try { await _db.SaveChangesAsync(); }
        catch (DbUpdateException ex) when (ex.InnerException?.Message.Contains("23505") == true)
        {
            return Conflict($"Permission '{req.PermissionName}' already exists.");
        }
        return CreatedAtAction(nameof(GetById), new { id = permission.PermissionId },
            new PermissionResponse(permission.PermissionId, permission.PermissionName, permission.Description));
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> Update(int id, UpdatePermissionRequest req)
    {
        var permission = await _db.Permissions.FindAsync(id);
        if (permission is null) return NotFound($"Permission with id {id} not found.");
        permission.PermissionName = req.PermissionName;
        permission.Description = req.Description;
        try { await _db.SaveChangesAsync(); }
        catch (DbUpdateException ex) when (ex.InnerException?.Message.Contains("23505") == true)
        {
            return Conflict($"Permission '{req.PermissionName}' already exists.");
        }
        return Ok(new PermissionResponse(permission.PermissionId, permission.PermissionName, permission.Description));
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
        var permission = await _db.Permissions.FindAsync(id);
        if (permission is null) return NotFound($"Permission with id {id} not found.");
        _db.Permissions.Remove(permission);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}