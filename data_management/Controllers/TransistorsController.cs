using DataManagement.Data;
using DataManagement.Dtos;
using DataManagement.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DataManagement.Controllers;

[ApiController]
[Route("[controller]")]
public class TransistorsController : ControllerBase
{
    private readonly AppDbContext _db;
    private static readonly string[] AllowedGeometryTypes = ["rectangular", "circular", "other"];

    public TransistorsController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult> GetAll() =>
        Ok(await _db.Transistors.Select(t => new TransistorResponse(
            t.TransistorId, t.GeometryType, t.GateWidthUm, t.GateLengthUm,
            t.GateInnerRadiusUm, t.GateOuterRadiusUm, t.CoverageSectorDegree, t.GeometryProperties,
            t.MobilityCm2Vs, t.OnOffRatio, t.ThresholdVoltageV, t.SubthresholdSwingMvDec, t.SgGapUm, t.DgGapUm))
        .ToListAsync());

    [HttpGet("{deviceId}")]
    public async Task<ActionResult> GetById(int deviceId)
    {
        var t = await _db.Transistors.FindAsync(deviceId);
        return t is null
            ? NotFound($"Transistor with device id {deviceId} not found.")
            : Ok(new TransistorResponse(t.TransistorId, t.GeometryType, t.GateWidthUm, t.GateLengthUm,
                t.GateInnerRadiusUm, t.GateOuterRadiusUm, t.CoverageSectorDegree, t.GeometryProperties,
                t.MobilityCm2Vs, t.OnOffRatio, t.ThresholdVoltageV, t.SubthresholdSwingMvDec, t.SgGapUm, t.DgGapUm));
    }

    [HttpPost]
    public async Task<ActionResult> Create(CreateTransistorRequest req)
    {
        if (!AllowedGeometryTypes.Contains(req.GeometryType))
            return BadRequest($"GeometryType must be one of: {string.Join(", ", AllowedGeometryTypes)}.");
        var t = new Transistor
        {
            TransistorId = req.TransistorId, GeometryType = req.GeometryType,
            GateWidthUm = req.GateWidthUm, GateLengthUm = req.GateLengthUm, GateInnerRadiusUm = req.GateInnerRadiusUm,
            GateOuterRadiusUm = req.GateOuterRadiusUm, CoverageSectorDegree = req.CoverageSectorDegree,
            GeometryProperties = req.GeometryProperties, MobilityCm2Vs = req.MobilityCm2Vs, OnOffRatio = req.OnOffRatio,
            ThresholdVoltageV = req.ThresholdVoltageV, SubthresholdSwingMvDec = req.SubthresholdSwingMvDec,
            SgGapUm = req.SgGapUm, DgGapUm = req.DgGapUm
        };
        _db.Transistors.Add(t);
        try { await _db.SaveChangesAsync(); }
        catch (DbUpdateException ex) when (ex.InnerException?.Message.Contains("23503") == true)
        {
            return NotFound($"Device with id {req.TransistorId} does not exist.");
        }
        catch (DbUpdateException ex) when (ex.InnerException?.Message.Contains("23505") == true)
        {
            return Conflict($"A transistor already exists for device id {req.TransistorId}.");
        }
        return CreatedAtAction(nameof(GetById), new { deviceId = t.TransistorId },
            new TransistorResponse(t.TransistorId, t.GeometryType, t.GateWidthUm, t.GateLengthUm,
                t.GateInnerRadiusUm, t.GateOuterRadiusUm, t.CoverageSectorDegree, t.GeometryProperties,
                t.MobilityCm2Vs, t.OnOffRatio, t.ThresholdVoltageV, t.SubthresholdSwingMvDec, t.SgGapUm, t.DgGapUm));
    }

    [HttpPut("{deviceId}")]
    public async Task<ActionResult> Update(int deviceId, UpdateTransistorRequest req)
    {
        if (!AllowedGeometryTypes.Contains(req.GeometryType))
            return BadRequest($"GeometryType must be one of: {string.Join(", ", AllowedGeometryTypes)}.");
        var t = await _db.Transistors.FindAsync(deviceId);
        if (t is null) return NotFound($"Transistor with device id {deviceId} not found.");
        t.GeometryType = req.GeometryType;
        t.GateWidthUm = req.GateWidthUm; t.GateLengthUm = req.GateLengthUm;
        t.GateInnerRadiusUm = req.GateInnerRadiusUm; t.GateOuterRadiusUm = req.GateOuterRadiusUm;
        t.CoverageSectorDegree = req.CoverageSectorDegree; t.GeometryProperties = req.GeometryProperties;
        t.MobilityCm2Vs = req.MobilityCm2Vs; t.OnOffRatio = req.OnOffRatio;
        t.ThresholdVoltageV = req.ThresholdVoltageV; t.SubthresholdSwingMvDec = req.SubthresholdSwingMvDec;
        t.SgGapUm = req.SgGapUm; t.DgGapUm = req.DgGapUm;
        await _db.SaveChangesAsync();
        return Ok(new TransistorResponse(t.TransistorId, t.GeometryType, t.GateWidthUm, t.GateLengthUm,
            t.GateInnerRadiusUm, t.GateOuterRadiusUm, t.CoverageSectorDegree, t.GeometryProperties,
            t.MobilityCm2Vs, t.OnOffRatio, t.ThresholdVoltageV, t.SubthresholdSwingMvDec, t.SgGapUm, t.DgGapUm));
    }

    [HttpDelete("{deviceId}")]
    public async Task<ActionResult> Delete(int deviceId)
    {
        var t = await _db.Transistors.FindAsync(deviceId);
        if (t is null) return NotFound($"Transistor with device id {deviceId} not found.");
        _db.Transistors.Remove(t);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}