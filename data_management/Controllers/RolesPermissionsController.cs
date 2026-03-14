using DataManagement.Data;
using DataManagement.Dtos;
using DataManagement.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DataManagement.Controllers;

[ApiController]
[Route("[controller]")]
public class RolesPermissionsController : ControllerBase
{
    private readonly AppDbContext _db;
    public RolesPermissionsController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult> GetAll() =>
        Ok(await _db.RolePermissions.Select(rp => new RolePermissionResponse(rp.RoleId, rp.PermissionId)).ToListAsync());

    [HttpGet("{roleId:int}/{permissionId:int}")]
    public async Task<ActionResult> GetById(int roleId, int permissionId)
    {
        var rp = await _db.RolePermissions.FindAsync(roleId, permissionId);
        return rp is null
            ? NotFound($"Role {roleId} does not have permission {permissionId}.")
            : Ok(new RolePermissionResponse(rp.RoleId, rp.PermissionId));
    }

    [HttpPost]
    public async Task<ActionResult> Create(CreateRolePermissionRequest req)
    {
        var rp = new RolePermission { RoleId = req.RoleId, PermissionId = req.PermissionId };
        _db.RolePermissions.Add(rp);
        try { await _db.SaveChangesAsync(); }
        catch (DbUpdateException ex) when (ex.InnerException?.Message.Contains("23503") == true)
        {
            return NotFound($"Role {req.RoleId} or permission {req.PermissionId} does not exist.");
        }
        catch (DbUpdateException ex) when (ex.InnerException?.Message.Contains("23505") == true)
        {
            return Conflict($"Role {req.RoleId} already has permission {req.PermissionId}.");
        }
        return CreatedAtAction(nameof(GetById), new { roleId = rp.RoleId, permissionId = rp.PermissionId },
            new RolePermissionResponse(rp.RoleId, rp.PermissionId));
    }

    [HttpDelete("{roleId:int}/{permissionId:int}")]
    public async Task<ActionResult> Delete(int roleId, int permissionId)
    {
        var rp = await _db.RolePermissions.FindAsync(roleId, permissionId);
        if (rp is null) return NotFound($"Role {roleId} does not have permission {permissionId}.");
        _db.RolePermissions.Remove(rp);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}