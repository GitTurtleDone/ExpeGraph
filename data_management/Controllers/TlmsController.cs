using DataManagement.Data;
using DataManagement.Dtos;
using DataManagement.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DataManagement.Controllers;

[ApiController]
[Route("[controller]")]
public class TlmsController : ControllerBase
{
    private readonly AppDbContext _db;
    private static readonly string[] AllowedGeometryTypes = ["rectangular", "circular", "other"];

    public TlmsController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult> GetAll([FromQuery] TlmQuery q)
    {
        var query = _db.Tlms.AsNoTracking();
        if (q.MinId is not null) query = query.Where(t => t.TlmId >= q.MinId);
        if (q.MaxId is not null) query = query.Where(t => t.TlmId <= q.MaxId);
        if (q.GeometryType is not null) query = query.Where(t => t.GeometryType == q.GeometryType);
        if (q.MinSheetResistanceOhmSq is not null) query = query.Where(t => t.SheetResistanceOhmSq >= q.MinSheetResistanceOhmSq);
        if (q.MaxSheetResistanceOhmSq is not null) query = query.Where(t => t.SheetResistanceOhmSq <= q.MaxSheetResistanceOhmSq);
        if (q.MinContactResistanceOhm is not null) query = query.Where(t => t.ContactResistanceOhm >= q.MinContactResistanceOhm);
        if (q.MaxContactResistanceOhm is not null) query = query.Where(t => t.ContactResistanceOhm <= q.MaxContactResistanceOhm);
        if (q.MinTransferLengthCm is not null) query = query.Where(t => t.TransferLengthCm >= q.MinTransferLengthCm);
        if (q.MaxTransferLengthCm is not null) query = query.Where(t => t.TransferLengthCm <= q.MaxTransferLengthCm);
        query = query.OrderBy(t => t.TlmId);
        return Ok(await query
                .Select(t => new TlmResponse(
                    t.TlmId, t.GeometryType, t.SheetResistanceOhmSq,
                    t.ContactResistanceOhm, t.TransferLengthCm
                ))
                .ToListAsync());
    }    
        // Ok(await _db.Tlms.Select(t => new TlmResponse(
        //     t.TlmId, t.GeometryType, t.SheetResistanceOhmSq, t.ContactResistanceOhm, t.TransferLengthCm))
        // .ToListAsync());

    [HttpGet("{id}")]
    public async Task<ActionResult> GetById(int id)
    {
        var tlm = await _db.Tlms.FindAsync(id);
        return tlm is null
            ? NotFound($"TLM with id {id} not found.")
            : Ok(new TlmResponse(tlm.TlmId, tlm.GeometryType, tlm.SheetResistanceOhmSq, tlm.ContactResistanceOhm, tlm.TransferLengthCm));
    }

    [HttpPost]
    public async Task<ActionResult> Create(CreateTlmRequest req)
    {
        if (!AllowedGeometryTypes.Contains(req.GeometryType))
            return BadRequest($"GeometryType must be one of: {string.Join(", ", AllowedGeometryTypes)}.");
        var tlm = new Tlm
        {
            GeometryType = req.GeometryType, SheetResistanceOhmSq = req.SheetResistanceOhmSq,
            ContactResistanceOhm = req.ContactResistanceOhm, TransferLengthCm = req.TransferLengthCm
        };
        _db.Tlms.Add(tlm);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = tlm.TlmId },
            new TlmResponse(tlm.TlmId, tlm.GeometryType, tlm.SheetResistanceOhmSq, tlm.ContactResistanceOhm, tlm.TransferLengthCm));
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> Update(int id, UpdateTlmRequest req)
    {
        if (!AllowedGeometryTypes.Contains(req.GeometryType))
            return BadRequest($"GeometryType must be one of: {string.Join(", ", AllowedGeometryTypes)}.");
        var tlm = await _db.Tlms.FindAsync(id);
        if (tlm is null) return NotFound($"TLM with id {id} not found.");
        tlm.GeometryType = req.GeometryType;
        tlm.SheetResistanceOhmSq = req.SheetResistanceOhmSq;
        tlm.ContactResistanceOhm = req.ContactResistanceOhm;
        tlm.TransferLengthCm = req.TransferLengthCm;
        await _db.SaveChangesAsync();
        return Ok(new TlmResponse(tlm.TlmId, tlm.GeometryType, tlm.SheetResistanceOhmSq, tlm.ContactResistanceOhm, tlm.TransferLengthCm));
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
        var tlm = await _db.Tlms.FindAsync(id);
        if (tlm is null) return NotFound($"TLM with id {id} not found.");
        _db.Tlms.Remove(tlm);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}