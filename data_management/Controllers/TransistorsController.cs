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
    public async Task<ActionResult> GetAll([FromQuery] TransistorQuery q)
    {
        var query = _db.Transistors.AsNoTracking();
        if (q.MinId is not null) query = query.Where(t => t.TransistorId >= q.MinId);
        if (q.MaxId is not null) query = query.Where(t => t.TransistorId <= q.MaxId);
        if (q.GeometryType is not null) query = query.Where(t => t.GeometryType == q.GeometryType);
        if (q.MinGateWidthUm is not null) query = query.Where(t => t.GateWidthUm >= q.MinGateWidthUm);
        if (q.MaxGateWidthUm is not null) query = query.Where(t => t.GateWidthUm <= q.MaxGateWidthUm);
        if (q.MinGateLengthUm is not null) query = query.Where(t => t.GateLengthUm >= q.MinGateLengthUm);
        if (q.MaxGateLengthUm is not null) query = query.Where(t => t.GateLengthUm <= q.MaxGateLengthUm);
        if (q.MinGateInnerRadiusUm is not null) query = query.Where(t => t.GateInnerRadiusUm >= q.MinGateInnerRadiusUm);
        if (q.MaxGateInnerRadiusUm is not null) query = query.Where(t => t.GateInnerRadiusUm <= q.MaxGateInnerRadiusUm);
        if (q.MinGateOuterRadiusUm is not null) query = query.Where(t => t.GateOuterRadiusUm >= q.MinGateOuterRadiusUm);
        if (q.MaxGateOuterRadiusUm is not null) query = query.Where(t => t.GateInnerRadiusUm <= q.MaxGateOuterRadiusUm);
        if (q.MinCoverageSectorDegree is not null) query = query.Where(t => t.CoverageSectorDegree >= q.MinCoverageSectorDegree);
        if (q.MaxCoverageSectorDegree is not null) query = query.Where(t => t.CoverageSectorDegree <= q.MaxCoverageSectorDegree);
        if (q.MinMobilityCm2Vs is not null) query = query.Where(t => t.MobilityCm2Vs >= q.MinMobilityCm2Vs);
        if (q.MaxMobilityCm2Vs is not null) query = query.Where(t => t.MobilityCm2Vs <= q.MaxMobilityCm2Vs);
        if (q.MinOnOffRatio is not null) query = query.Where(t => t.OnOffRatio >= q.MinOnOffRatio);
        if (q.MaxOnOffRatio is not null) query = query.Where(t => t.OnOffRatio <= q.MaxOnOffRatio);
        if (q.MinThresholdVoltageV is not null) query = query.Where(t => t.ThresholdVoltageV >= q.MinThresholdVoltageV);
        if (q.MaxThresholdVoltageV is not null) query = query.Where(t => t.ThresholdVoltageV <= q.MaxThresholdVoltageV);
        if (q.MinSubthresholdSwingMvDec is not null) query = query.Where(t => t.SubthresholdSwingMvDec >= q.MinSubthresholdSwingMvDec);
        if (q.MaxSubthresholdSwingMvDec is not null) query = query.Where(t => t.SubthresholdSwingMvDec <= q.MaxSubthresholdSwingMvDec);
        if (q.MinSgGapUm is not null) query = query.Where(t => t.SgGapUm >= q.MinSgGapUm);
        if (q.MaxSgGapUm is not null) query = query.Where(t => t.SgGapUm <= q.MaxSgGapUm);
        if (q.MinDgGapUm is not null) query = query.Where(t => t.DgGapUm >= q.MinDgGapUm);
        if (q.MaxDgGapUm is not null) query = query.Where(t => t.DgGapUm <= q.MaxDgGapUm);
        query = query.OrderBy(t => t.TransistorId);
        return Ok(await query
                .Select(t => new TransistorResponse(
                    t.TransistorId, t.GeometryType, t.GateWidthUm, t.GateLengthUm,
                    t.GateInnerRadiusUm, t.GateOuterRadiusUm, t.CoverageSectorDegree,
                    t.GeometryProperties, t.MobilityCm2Vs, t.OnOffRatio, t.ThresholdVoltageV,
                    t.SubthresholdSwingMvDec, t.SgGapUm, t.DgGapUm
                ))
                .ToListAsync());
        
    }
        // Ok(await _db.Transistors.Select(t => new TransistorResponse(
        //     t.TransistorId, t.GeometryType, t.GateWidthUm, t.GateLengthUm,
        //     t.GateInnerRadiusUm, t.GateOuterRadiusUm, t.CoverageSectorDegree, t.GeometryProperties,
        //     t.MobilityCm2Vs, t.OnOffRatio, t.ThresholdVoltageV, t.SubthresholdSwingMvDec, t.SgGapUm, t.DgGapUm))
        // .ToListAsync());

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