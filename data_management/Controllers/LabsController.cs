using DataManagement.Data;
using DataManagement.Dtos;
using DataManagement.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DataManagement.Controllers;

[ApiController]
[Route("[controller]")]
public class LabsController : ControllerBase
{
    private readonly AppDbContext _db;

    public LabsController(AppDbContext db)
    {
        _db = db;
    }

    //GET labs/
    [HttpGet]
    public async Task<ActionResult> GetAll() => 
        Ok(await _db.Labs.Select(l => new LabResponse(
            l.LabId, l.LabName, l.Description, l.LabLeaderId, l.CreatedAt))
        .ToListAsync());

    [HttpGet("{id}")]
    public async Task<ActionResult> GetById(int id)
    {
        var lab = await _db.Labs.FindAsync(id);
        return lab is null 
            ? NotFound($"Lab with id {id} was not found.") 
            : Ok(new LabResponse(lab.LabId, lab.LabName, lab.Description, lab.LabLeaderId, lab.CreatedAt));
    }

    [HttpPost]
    public async Task<ActionResult> Create(CreateLabRequest req)
    {
        var lab = new Lab
        {
            LabName = req.LabName,
            Description = req.Description,
            LabLeaderId = req.LabLeaderId,
        };
        _db.Labs.Add(lab);
        try
        {
            await _db.SaveChangesAsync();
        }
        catch (DbUpdateException ex) when (ex.InnerException?.Message.Contains("23503") == true)
        {
            return NotFound($"Lab leader with id {req.LabLeaderId} does not exist.");
        }
        return CreatedAtAction(nameof(GetById), new { id = lab.LabId }, 
                    new LabResponse(
                        lab.LabId, lab.LabName, lab.Description, 
                        lab.LabLeaderId, lab.CreatedAt));
    }

    //PUT labs/{id}
    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateLab(int id, UpdateLabRequest req)
    {
        var lab = await _db.Labs.FindAsync(id);
        if (lab is null)
            return NotFound($"Lab with id {id} not found.");
        lab.LabName = req.LabName;
        lab.Description = req.Description;
        lab.LabLeaderId = req.LabLeaderId;
        try
        {
            await _db.SaveChangesAsync();
        }
        catch (DbUpdateException ex) when (ex.InnerException?.Message.Contains("23503") == true)
        {
            return NotFound($"User with id {req.LabLeaderId} does not exist.");
        }
        return Ok(new LabResponse(
                        lab.LabId, lab.LabName, lab.Description, 
                        lab.LabLeaderId, lab.CreatedAt));
    }

    //DELETE labs/{id}
    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
        var lab = await _db.Labs.FindAsync(id);
        if (lab is null) return NotFound($"Lab with id {id} was not found.");
        _db.Labs.Remove(lab);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
