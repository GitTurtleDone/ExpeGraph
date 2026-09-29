using DataManagement.Data;
using DataManagement.Dtos;
using DataManagement.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;

namespace DataManagement.Controllers;

[ApiController]
[Route("[controller]")]
public class ResistorsController : ControllerBase
{
    private readonly AppDbContext _db;
    private static readonly string[] AllowedGeometryTypes = ["rectangular", "circular", "other"];

    public ResistorsController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult> GetAll([FromQuery] ResistorQuery q)
    {
        var query = _db.Resistors.AsNoTracking();
        if (q.MinWidthUm is not null) query = query.Where(r => r.ResistorId >= q.MinId);
        if (q.MaxWidthUm is not null) query = query.Where(r => r.ResistorId <= q.MaxId);
        if (q.GeometryType is not null) query = query.Where(r => r.GeometryType == q.GeometryType);
        if (q.MinId is not null) query = query.Where(r => r.WidthUm >= q.MinWidthUm);
        if (q.MaxId is not null) query = query.Where(r => r.WidthUm <= q.MaxWidthUm);
        if (q.MinGapUm is not null) query = query.Where(r => r.GapUm >= q.MinGapUm);
        if (q.MaxGapUm is not null) query = query.Where(r => r.GapUm <= q.MaxGapUm);
        if (q.MinInnerRadiusUm is not null) query = query.Where(r => r.InnerRadiusUm >= q.MinInnerRadiusUm);
        if (q.MaxInnerRadiusUm is not null) query = query.Where(r => r.InnerRadiusUm <= q.MaxInnerRadiusUm);
        if (q.MinOuterRadiusUm is not null) query = query.Where(r => r.OuterRadiusUm >= q.MinOuterRadiusUm);
        if (q.MaxOuterRadiusUm is not null) query = query.Where(r => r.OuterRadiusUm <= q.MaxOuterRadiusUm);
        if (q.MinResistanceOhm is not null) query = query.Where(r => r.ResistanceOhm >= q.MinResistanceOhm);
        if (q.MaxResistanceOhm is not null) query = query.Where(r => r.ResistanceOhm <= q.MaxResistanceOhm);
        if (q.TlmId is not null) query = query.Where(r => r.TlmId == q.TlmId);
        query = query.OrderBy(r => r.ResistorId);
        return Ok(await query
                .Select(r => new ResistorResponse(
                    r.ResistorId, r.GeometryType, r.WidthUm, 
                    r.GapUm, r.InnerRadiusUm, r.OuterRadiusUm, r.GeometryProperties,
                    r.ResistanceOhm, r.TlmId
                ))
                .ToListAsync());
    }
        // Ok(await _db.Resistors.Select(r => new ResistorResponse(
        //     r.ResistorId, r.GeometryType, r.WidthUm, r.GapUm,
        //     r.InnerRadiusUm, r.OuterRadiusUm, r.GeometryProperties, r.ResistanceOhm, r.TlmId))
        // .ToListAsync());

    [HttpGet("{deviceId}")]
    public async Task<ActionResult> GetById(int deviceId)
    {
        var r = await _db.Resistors.FindAsync(deviceId);
        return r is null
            ? NotFound($"Resistor with device id {deviceId} not found.")
            : Ok(new ResistorResponse(r.ResistorId, r.GeometryType, r.WidthUm, r.GapUm,
                r.InnerRadiusUm, r.OuterRadiusUm, r.GeometryProperties, r.ResistanceOhm, r.TlmId));
    }

    [HttpPost]
    public async Task<ActionResult> Create(CreateResistorRequest req)
    {
        if (!AllowedGeometryTypes.Contains(req.GeometryType))
            return BadRequest($"GeometryType must be one of: {string.Join(", ", AllowedGeometryTypes)}.");
        var r = new Resistor
        {
            ResistorId = req.ResistorId, GeometryType = req.GeometryType,
            WidthUm = req.WidthUm, GapUm = req.GapUm, InnerRadiusUm = req.InnerRadiusUm,
            OuterRadiusUm = req.OuterRadiusUm, GeometryProperties = req.GeometryProperties,
            ResistanceOhm = req.ResistanceOhm, TlmId = req.TlmId
        };
        _db.Resistors.Add(r);
        try { await _db.SaveChangesAsync(); }
        catch (DbUpdateException ex) when (ex.InnerException?.Message.Contains("23503") == true)
        {
            return NotFound($"Device with id {req.ResistorId} or TLM with id {req.TlmId} does not exist.");
        }
        catch (DbUpdateException ex) when (ex.InnerException?.Message.Contains("23505") == true)
        {
            return Conflict($"A resistor already exists for device id {req.ResistorId}.");
        }
        return CreatedAtAction(nameof(GetById), new { deviceId = r.ResistorId },
            new ResistorResponse(r.ResistorId, r.GeometryType, r.WidthUm, r.GapUm,
                r.InnerRadiusUm, r.OuterRadiusUm, r.GeometryProperties, r.ResistanceOhm, r.TlmId));
    }

    [HttpPut("{deviceId}")]
    public async Task<ActionResult> Update(int deviceId, UpdateResistorRequest req)
    {
        if (!AllowedGeometryTypes.Contains(req.GeometryType))
            return BadRequest($"GeometryType must be one of: {string.Join(", ", AllowedGeometryTypes)}.");
        var r = await _db.Resistors.FindAsync(deviceId);
        if (r is null) return NotFound($"Resistor with device id {deviceId} not found.");
        r.GeometryType = req.GeometryType;
        r.WidthUm = req.WidthUm; r.GapUm = req.GapUm;
        r.InnerRadiusUm = req.InnerRadiusUm; r.OuterRadiusUm = req.OuterRadiusUm;
        r.GeometryProperties = req.GeometryProperties; r.ResistanceOhm = req.ResistanceOhm;
        r.TlmId = req.TlmId;
        try { await _db.SaveChangesAsync(); }
        catch (DbUpdateException ex) when (ex.InnerException?.Message.Contains("23503") == true)
        {
            return NotFound($"TLM with id {req.TlmId} does not exist.");
        }
        return Ok(new ResistorResponse(r.ResistorId, r.GeometryType, r.WidthUm, r.GapUm,
            r.InnerRadiusUm, r.OuterRadiusUm, r.GeometryProperties, r.ResistanceOhm, r.TlmId));
    }

    [HttpDelete("{deviceId}")]
    public async Task<ActionResult> Delete(int deviceId)
    {
        var r = await _db.Resistors.FindAsync(deviceId);
        if (r is null) return NotFound($"Resistor with device id {deviceId} not found.");
        _db.Resistors.Remove(r);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}