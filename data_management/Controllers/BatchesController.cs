using DataManagement.Data;
using DataManagement.Dtos;
using DataManagement.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DataManagement.Controllers;

[ApiController]
[Route("[controller]")]         // → /batches  (class name minus "Controller")
public class BatchesController : ControllerBase
{
    private readonly AppDbContext _db;

    public BatchesController(AppDbContext db)
    {
        _db = db;
    }

    // GET /batches
    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await _db.Batches
            .Select(b => new BatchResponse(
                b.BatchId, b.BatchName, b.Description, b.FabricationDate,
                b.Treatment, b.ProjectId, b.LabId, b.CreatedAt))
            .ToListAsync());

    // GET /batches/5
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var batch = await _db.Batches.FindAsync(id);
        return batch is null
            ? NotFound()
            : Ok(new BatchResponse(
                batch.BatchId, batch.BatchName, batch.Description, batch.FabricationDate,
                batch.Treatment, batch.ProjectId, batch.LabId, batch.CreatedAt));
    }

    // POST /batches
    [HttpPost]
    public async Task<IActionResult> Create(CreateBatchRequest req)
    {
        var batch = new Batch
        {
            BatchName = req.BatchName,
            FabricationDate = req.FabricationDate,
            Description = req.Description,
            Treatment = req.Treatment,
            ProjectId = req.ProjectId,
            LabId = req.LabId
        };

        _db.Batches.Add(batch);
        try
        {
            await _db.SaveChangesAsync();
        }
        catch (DbUpdateException ex) when (ex.InnerException?.Message.Contains("23503") == true)
        {
            return BadRequest($"Project with id {req.ProjectId} or lab with id {req.LabId} does not exist");
        }
        catch (DbUpdateException ex) when (ex.InnerException?.Message.Contains("23505") == true)
        {
            return Conflict($"Batch with name {req.BatchName}  already exists");
        }

        return CreatedAtAction(nameof(GetById), new { id = batch.BatchId },
            new BatchResponse(
                batch.BatchId, batch.BatchName, batch.Description, batch.FabricationDate,
                batch.Treatment, batch.ProjectId, batch.LabId, batch.CreatedAt));
    }

    // PUT /batches/5
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, UpdateBatchRequest req)
    {
        var batch = await _db.Batches.FindAsync(id);
        if (batch is null) return NotFound();

        batch.BatchName = req.BatchName;
        batch.FabricationDate = req.FabricationDate;
        batch.Description = req.Description;
        batch.Treatment = req.Treatment;
        batch.ProjectId = req.ProjectId;
        batch.LabId = req.LabId;
        try
        {
            await _db.SaveChangesAsync();                
        }
        catch (DbUpdateException ex) when (ex.InnerException?.Message.Contains("23503") == true)
        {
            return BadRequest($"Project with id {req.ProjectId} or lab with id {req.LabId} does not exist");
        }
        

        return Ok(new BatchResponse(
            batch.BatchId, batch.BatchName, batch.Description, batch.FabricationDate,
            batch.Treatment, batch.ProjectId, batch.LabId, batch.CreatedAt));
    }

    // DELETE /batches/5
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var batch = await _db.Batches.FindAsync(id);
        if (batch is null) return NotFound();

        _db.Batches.Remove(batch);
        await _db.SaveChangesAsync();

        return NoContent();
    }
}
