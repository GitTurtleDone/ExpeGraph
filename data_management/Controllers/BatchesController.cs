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
    public async Task<IActionResult> GetAll([FromQuery] BatchQuery q)
    {
        //Applying filtering from the frontend query
        // leave server pagination for now
        // var page = Math.Max(1, q.Page);
        // var pageSize = Math.Clamp(q.PageSize, 1, 200);

        //Skip snapshoting
        var query = _db.Batches.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(q.Search))
        {
            var search_words = $"%{q.Search.Trim()}%";
            query = query.Where(b =>
                EF.Functions.ILike(b.BatchName, search_words) ||
                EF.Functions.ILike(b.Description, search_words) || 
                EF.Functions.ILike(b.Treatment, search_words));
            
        }
        
        //filtering batches by the Id and FabricationDate ranges and ProjectId and LabId
        if (q.MinId is not null) query = query.Where(b => b.BatchId >= q.MinId);
        if (q.MaxId is not null) query = query.Where(b => b.BatchId <= q.MaxId);
        if (q.FabricatedFrom is not null)  query = query.Where(b => b.FabricationDate >= q.FabricatedFrom);
        if (q.FabricatedTo is not null) query = query.Where(b => b.FabricationDate <= q.FabricatedTo);
        if (q.ProjectId is not null) query = query.Where(b => b.ProjectId == q.ProjectId);
        if (q.LabId is not null) query = query.Where(b => b.LabId == q.LabId);

        var desc = string.Equals(q.Order, "desc", StringComparison.OrdinalIgnoreCase);

        query = (q.Sort?.ToLowerInvariant(), desc) switch
        {
            ("batchname", false) => query.OrderBy(b => b.BatchName).ThenBy(b => b.BatchId),
            ("batchname", true) => query.OrderByDescending(b => b.BatchName).ThenBy(b => b.BatchId),
            ("fabricationdate", false) => query.OrderBy(b => b.FabricationDate).ThenBy(b => b.BatchId),
            ("fabricationdate", true) => query.OrderBy(b => b.FabricationDate).ThenBy(b => b.BatchId),
            (_, true) => query.OrderByDescending(b => b.BatchId),
            _ => query.OrderBy(b => b.BatchId),
        };
        

        return Ok(await query
            .Select(b => new BatchResponse(
                b.BatchId, b.BatchName, b.Description, b.FabricationDate,
                b.Treatment, b.ProjectId, b.LabId, b.CreatedAt))
            .ToListAsync());
    }    
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
