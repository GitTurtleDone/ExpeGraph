using DataManagement.Data;
using DataManagement.Dtos;
using DataManagement.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DataManagement.Controllers;

[ApiController]
[Route("[controller]")]
public class ResistorsController : ControllerBase
{
    private readonly AppDbContext _db;
    private static readonly string[] AllowedGeometryTypes = ["rectangular", "circular", "other"];

    public ResistorsController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult> GetAll() =>
        Ok(await _db.Resistors.Select(r => new ResistorResponse(
            r.ResistorId, r.ResistorName, r.GeometryType, r.WidthUm, r.GapUm,
            r.InnerRadiusUm, r.OuterRadiusUm, r.GeometryProperties, r.ResistanceOhm, r.TlmId))
        .ToListAsync());

    [HttpGet("{deviceId}")]
    public async Task<ActionResult> GetById(int deviceId)
    {
        var r = await _db.Resistors.FindAsync(deviceId);
        return r is null
            ? NotFound($"Resistor with device id {deviceId} not found.")
            : Ok(new ResistorResponse(r.ResistorId, r.ResistorName, r.GeometryType, r.WidthUm, r.GapUm,
                r.InnerRadiusUm, r.OuterRadiusUm, r.GeometryProperties, r.ResistanceOhm, r.TlmId));
    }

    [HttpPost]
    public async Task<ActionResult> Create(CreateResistorRequest req)
    {
        if (!AllowedGeometryTypes.Contains(req.GeometryType))
            return BadRequest($"GeometryType must be one of: {string.Join(", ", AllowedGeometryTypes)}.");
        var r = new Resistor
        {
            ResistorId = req.ResistorId, ResistorName = req.ResistorName, GeometryType = req.GeometryType,
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
            new ResistorResponse(r.ResistorId, r.ResistorName, r.GeometryType, r.WidthUm, r.GapUm,
                r.InnerRadiusUm, r.OuterRadiusUm, r.GeometryProperties, r.ResistanceOhm, r.TlmId));
    }

    [HttpPut("{deviceId}")]
    public async Task<ActionResult> Update(int deviceId, UpdateResistorRequest req)
    {
        if (!AllowedGeometryTypes.Contains(req.GeometryType))
            return BadRequest($"GeometryType must be one of: {string.Join(", ", AllowedGeometryTypes)}.");
        var r = await _db.Resistors.FindAsync(deviceId);
        if (r is null) return NotFound($"Resistor with device id {deviceId} not found.");
        r.ResistorName = req.ResistorName; r.GeometryType = req.GeometryType;
        r.WidthUm = req.WidthUm; r.GapUm = req.GapUm;
        r.InnerRadiusUm = req.InnerRadiusUm; r.OuterRadiusUm = req.OuterRadiusUm;
        r.GeometryProperties = req.GeometryProperties; r.ResistanceOhm = req.ResistanceOhm;
        r.TlmId = req.TlmId;
        try { await _db.SaveChangesAsync(); }
        catch (DbUpdateException ex) when (ex.InnerException?.Message.Contains("23503") == true)
        {
            return NotFound($"TLM with id {req.TlmId} does not exist.");
        }
        return Ok(new ResistorResponse(r.ResistorId, r.ResistorName, r.GeometryType, r.WidthUm, r.GapUm,
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