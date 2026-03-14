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
    public async Task<ActionResult> GetAll() =>
        Ok(await _db.Tlms.Select(t => new TlmResponse(
            t.TlmId, t.GeometryType, t.SheetResistanceOhmSq, t.ContactResistanceOhm, t.TransferLengthCm))
        .ToListAsync());

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