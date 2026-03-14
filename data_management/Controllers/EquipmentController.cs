using DataManagement.Data;
using DataManagement.Dtos;
using DataManagement.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DataManagement.Controllers;

[ApiController]
[Route("[controller]")]
public class EquipmentController : ControllerBase
{
    private readonly AppDbContext _db;
    public EquipmentController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult> GetAll() =>
        Ok(await _db.Equipment.Select(e => new EquipmentResponse(
            e.EquipmentId, e.EquipmentName, e.Manufacturer, e.Model, e.SerialNumber,
            e.PurchaseYear, e.CalibrationDue, e.Location, e.ConnectingStr, e.Notes))
        .ToListAsync());

    [HttpGet("{id}")]
    public async Task<ActionResult> GetById(int id)
    {
        var eq = await _db.Equipment.FindAsync(id);
        return eq is null
            ? NotFound($"Equipment with id {id} not found.")
            : Ok(new EquipmentResponse(eq.EquipmentId, eq.EquipmentName, eq.Manufacturer, eq.Model,
                eq.SerialNumber, eq.PurchaseYear, eq.CalibrationDue, eq.Location, eq.ConnectingStr, eq.Notes));
    }

    [HttpPost]
    public async Task<ActionResult> Create(CreateEquipmentRequest req)
    {
        var eq = new Equipment
        {
            EquipmentName = req.EquipmentName, Manufacturer = req.Manufacturer, Model = req.Model,
            SerialNumber = req.SerialNumber, PurchaseYear = req.PurchaseYear, CalibrationDue = req.CalibrationDue,
            Location = req.Location, ConnectingStr = req.ConnectingStr, Notes = req.Notes
        };
        _db.Equipment.Add(eq);
        try { await _db.SaveChangesAsync(); }
        catch (DbUpdateException ex) when (ex.InnerException?.Message.Contains("23505") == true)
        {
            return Conflict($"Equipment with serial number '{req.SerialNumber}' already exists.");
        }
        return CreatedAtAction(nameof(GetById), new { id = eq.EquipmentId },
            new EquipmentResponse(eq.EquipmentId, eq.EquipmentName, eq.Manufacturer, eq.Model,
                eq.SerialNumber, eq.PurchaseYear, eq.CalibrationDue, eq.Location, eq.ConnectingStr, eq.Notes));
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> Update(int id, UpdateEquipmentRequest req)
    {
        var eq = await _db.Equipment.FindAsync(id);
        if (eq is null) return NotFound($"Equipment with id {id} not found.");
        eq.EquipmentName = req.EquipmentName; eq.Manufacturer = req.Manufacturer; eq.Model = req.Model;
        eq.SerialNumber = req.SerialNumber; eq.PurchaseYear = req.PurchaseYear; eq.CalibrationDue = req.CalibrationDue;
        eq.Location = req.Location; eq.ConnectingStr = req.ConnectingStr; eq.Notes = req.Notes;
        try { await _db.SaveChangesAsync(); }
        catch (DbUpdateException ex) when (ex.InnerException?.Message.Contains("23505") == true)
        {
            return Conflict($"Equipment with serial number '{req.SerialNumber}' already exists.");
        }
        return Ok(new EquipmentResponse(eq.EquipmentId, eq.EquipmentName, eq.Manufacturer, eq.Model,
            eq.SerialNumber, eq.PurchaseYear, eq.CalibrationDue, eq.Location, eq.ConnectingStr, eq.Notes));
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
        var eq = await _db.Equipment.FindAsync(id);
        if (eq is null) return NotFound($"Equipment with id {id} not found.");
        _db.Equipment.Remove(eq);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}