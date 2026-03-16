using DataManagement.Data;
using DataManagement.Dtos;
using DataManagement.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DataManagement.Controllers;

[ApiController]
[Route("[controller]")]
public class DiodesController : ControllerBase
{
    private readonly AppDbContext _db;
    private static readonly string[] AllowedGeometryTypes = ["rectangular", "circular", "other"];

    public DiodesController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult> GetAll() =>
        Ok(await _db.Diodes.Select(d => new DiodeResponse(
            d.DiodeId, d.GeometryType, d.AnodeWidthUm, d.AnodeLengthUm, d.ChamferRadiusUm,
            d.AnodeRadiusUm, d.GeometryProperties, d.BarrierHeightEv, d.IdealityFactor, d.RecRatio,
            d.BuiltInPotentialV, d.CarrierConcentration, d.MaxCurrentA, d.VoltageAtMaxCurrentV, d.BreakdownVoltageV))
        .ToListAsync());

    [HttpGet("{deviceId}")]
    public async Task<ActionResult> GetById(int deviceId)
    {
        var d = await _db.Diodes.FindAsync(deviceId);
        return d is null
            ? NotFound($"Diode with device id {deviceId} not found.")
            : Ok(new DiodeResponse(d.DiodeId, d.GeometryType, d.AnodeWidthUm, d.AnodeLengthUm,
                d.ChamferRadiusUm, d.AnodeRadiusUm, d.GeometryProperties, d.BarrierHeightEv, d.IdealityFactor,
                d.RecRatio, d.BuiltInPotentialV, d.CarrierConcentration, d.MaxCurrentA, d.VoltageAtMaxCurrentV, d.BreakdownVoltageV));
    }

    [HttpPost]
    public async Task<ActionResult> Create(CreateDiodeRequest req)
    {
        if (!AllowedGeometryTypes.Contains(req.GeometryType))
            return BadRequest($"GeometryType must be one of: {string.Join(", ", AllowedGeometryTypes)}.");
        var d = new Diode
        {
            DiodeId = req.DiodeId, GeometryType = req.GeometryType,
            AnodeWidthUm = req.AnodeWidthUm, AnodeLengthUm = req.AnodeLengthUm, ChamferRadiusUm = req.ChamferRadiusUm,
            AnodeRadiusUm = req.AnodeRadiusUm, GeometryProperties = req.GeometryProperties,
            BarrierHeightEv = req.BarrierHeightEv, IdealityFactor = req.IdealityFactor, RecRatio = req.RecRatio,
            BuiltInPotentialV = req.BuiltInPotentialV, CarrierConcentration = req.CarrierConcentration,
            MaxCurrentA = req.MaxCurrentA, VoltageAtMaxCurrentV = req.VoltageAtMaxCurrentV, BreakdownVoltageV = req.BreakdownVoltageV
        };
        _db.Diodes.Add(d);
        try { await _db.SaveChangesAsync(); }
        catch (DbUpdateException ex) when (ex.InnerException?.Message.Contains("23503") == true)
        {
            return NotFound($"Device with id {req.DiodeId} does not exist.");
        }
        catch (DbUpdateException ex) when (ex.InnerException?.Message.Contains("23505") == true)
        {
            return Conflict($"A diode already exists for device id {req.DiodeId}.");
        }
        return CreatedAtAction(nameof(GetById), new { deviceId = d.DiodeId },
            new DiodeResponse(d.DiodeId, d.GeometryType, d.AnodeWidthUm, d.AnodeLengthUm,
                d.ChamferRadiusUm, d.AnodeRadiusUm, d.GeometryProperties, d.BarrierHeightEv, d.IdealityFactor,
                d.RecRatio, d.BuiltInPotentialV, d.CarrierConcentration, d.MaxCurrentA, d.VoltageAtMaxCurrentV, d.BreakdownVoltageV));
    }

    [HttpPut("{deviceId}")]
    public async Task<ActionResult> Update(int deviceId, UpdateDiodeRequest req)
    {
        if (!AllowedGeometryTypes.Contains(req.GeometryType))
            return BadRequest($"GeometryType must be one of: {string.Join(", ", AllowedGeometryTypes)}.");
        var d = await _db.Diodes.FindAsync(deviceId);
        if (d is null) return NotFound($"Diode with device id {deviceId} not found.");
        d.GeometryType = req.GeometryType;
        d.AnodeWidthUm = req.AnodeWidthUm; d.AnodeLengthUm = req.AnodeLengthUm; d.ChamferRadiusUm = req.ChamferRadiusUm;
        d.AnodeRadiusUm = req.AnodeRadiusUm; d.GeometryProperties = req.GeometryProperties;
        d.BarrierHeightEv = req.BarrierHeightEv; d.IdealityFactor = req.IdealityFactor; d.RecRatio = req.RecRatio;
        d.BuiltInPotentialV = req.BuiltInPotentialV; d.CarrierConcentration = req.CarrierConcentration;
        d.MaxCurrentA = req.MaxCurrentA; d.VoltageAtMaxCurrentV = req.VoltageAtMaxCurrentV; d.BreakdownVoltageV = req.BreakdownVoltageV;
        await _db.SaveChangesAsync();
        return Ok(new DiodeResponse(d.DiodeId, d.GeometryType, d.AnodeWidthUm, d.AnodeLengthUm,
            d.ChamferRadiusUm, d.AnodeRadiusUm, d.GeometryProperties, d.BarrierHeightEv, d.IdealityFactor,
            d.RecRatio, d.BuiltInPotentialV, d.CarrierConcentration, d.MaxCurrentA, d.VoltageAtMaxCurrentV, d.BreakdownVoltageV));
    }

    [HttpDelete("{deviceId}")]
    public async Task<ActionResult> Delete(int deviceId)
    {
        var d = await _db.Diodes.FindAsync(deviceId);
        if (d is null) return NotFound($"Diode with device id {deviceId} not found.");
        _db.Diodes.Remove(d);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}