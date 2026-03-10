using DataManagement.Data;
using DataManagement.Dtos;
using DataManagement.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DataManagement.Controllers;

[ApiController]
[Route("[controller]")]

public class SamplesController: ControllerBase
{	
	private readonly AppDbContext _db;
	public SamplesController(AppDbContext db)
	{
		_db = db;
	}
	[HttpGet]
	public async Task<IActionResult> GetAll() =>
		Ok(await _db.Samples
			.Select(s => new SampleResponse(
			s.SampleId, s.SampleName, s.Description, s.Treatment, s.Properties, s.BatchId, s.CreatedAt))
			.ToListAsync());
	
	
	[HttpGet("{id:int}")]
	public async Task<IActionResult> GetById(int id)
	{
		var sample = await _db.Samples.FindAsync(id);
		
		return sample is null
		? NotFound()
		: Ok(new SampleResponse(sample.SampleId, sample.SampleName, sample.Description, sample.Treatment, sample.Properties, sample.BatchId, sample.CreatedAt));
	}
	
	[HttpPost]
	public async Task<IActionResult> Create(CreateSampleRequest req)
	{
		if (req.BatchId.HasValue && !await _db.Batches.AnyAsync(b => b.BatchId == req.BatchId.Value))
			return BadRequest($"Batch with id {req.BatchId} does not exist.");

		var sample = new Sample
		{
			SampleName = req.SampleName,
			Description = req.Description,
			Treatment = req.Treatment,
			Properties = req.Properties,
			BatchId = req.BatchId
		};
		_db.Samples.Add(sample);
		await _db.SaveChangesAsync();

		return CreatedAtAction(nameof(GetById), new { id = sample.SampleId },
        new SampleResponse(
            sample.SampleId, sample.SampleName, sample.Description,
            sample.Treatment, sample.Properties, sample.BatchId, sample.CreatedAt));
	}

	[HttpPut("{id:int}")]
	public async Task<IActionResult> Update(int id, UpdateSampleRequest req)
	{
		if (req.BatchId.HasValue && !await _db.Batches.AnyAsync(b => b.BatchId == req.BatchId.Value))
			return BadRequest($"Batch with id {req.BatchId} does not exist.");

		var sample = await _db.Samples.FindAsync(id);
		if (sample is null) return NotFound();

		sample.SampleName = req.SampleName;
		sample.Description = req.Description;
		sample.Treatment = req.Treatment;
		sample.Properties = req.Properties;
		sample.BatchId = req.BatchId;
		await _db.SaveChangesAsync();
		return Ok(new SampleResponse(
			sample.SampleId, sample.SampleName, sample.Description,
            sample.Treatment, sample.Properties, sample.BatchId, sample.CreatedAt));
	}
	
	[HttpDelete("{id:int}")]
	public async Task<IActionResult> Delete(int id)
	{
		var sample = await _db.Samples.FindAsync(id);
		if (sample is null) return NotFound();
		_db.Samples.Remove(sample);
		await _db.SaveChangesAsync();
		return NoContent();
	}
}