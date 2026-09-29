using DataManagement.Data;
using DataManagement.Dtos;
using DataManagement.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.ObjectPool;

namespace DataManagement.Controllers;

[ApiController]
[Route("[controller]")]
public class LabsEquipmentController : ControllerBase
{
    private readonly AppDbContext _db;
    public LabsEquipmentController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult> GetAll([FromQuery] LabEquipmentQuery q)
    {
        var query = _db.LabEquipments.AsNoTracking();
        if (q.LabId is not null) query = query.Where(le => le.LabId == q.LabId);
        if (q.EquipmentId is not null) query = query.Where(le => le.EquipmentId == q.EquipmentId);
        query = query.OrderBy(lp => lp.LabId);
        return Ok (await query
            .Select(lp => new LabEquipmentResponse(
                lp.LabId, lp.EquipmentId
            ))
            .ToListAsync());
    } 
        // Ok(await _db.LabEquipments.Select(le => new LabEquipmentResponse(le.LabId, le.EquipmentId)).ToListAsync());

    [HttpGet("{labId:int}/{equipmentId:int}")]
    public async Task<ActionResult> GetById(int labId, int equipmentId)
    {
        var le = await _db.LabEquipments.FindAsync(labId, equipmentId);
        return le is null
            ? NotFound($"Lab {labId} does not have equipment {equipmentId}.")
            : Ok(new LabEquipmentResponse(le.LabId, le.EquipmentId));
    }

    [HttpPost]
    public async Task<ActionResult> Create(CreateLabEquipmentRequest req)
    {
        var le = new LabEquipment { LabId = req.LabId, EquipmentId = req.EquipmentId };
        _db.LabEquipments.Add(le);
        try { await _db.SaveChangesAsync(); }
        catch (DbUpdateException ex) when (ex.InnerException?.Message.Contains("23503") == true)
        {
            return NotFound($"Lab {req.LabId} or equipment {req.EquipmentId} does not exist.");
        }
        catch (DbUpdateException ex) when (ex.InnerException?.Message.Contains("23505") == true)
        {
            return Conflict($"Lab {req.LabId} already has equipment {req.EquipmentId}.");
        }
        return CreatedAtAction(nameof(GetById), new { labId = le.LabId, equipmentId = le.EquipmentId },
            new LabEquipmentResponse(le.LabId, le.EquipmentId));
    }

    [HttpDelete("{labId:int}/{equipmentId:int}")]
    public async Task<ActionResult> Delete(int labId, int equipmentId)
    {
        var le = await _db.LabEquipments.FindAsync(labId, equipmentId);
        if (le is null) return NotFound($"Lab {labId} does not have equipment {equipmentId}.");
        _db.LabEquipments.Remove(le);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}