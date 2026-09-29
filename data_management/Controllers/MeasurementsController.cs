using DataManagement.Data;
using DataManagement.Dtos;
using DataManagement.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DataManagement.Controllers;

[ApiController]
[Route("[controller]")]

public class MeasurementsController: ControllerBase
{
	private readonly AppDbContext _db;
	public MeasurementsController (AppDbContext db)
	{
		_db = db;
	}
	[HttpGet]
	public async Task<IActionResult> GetAll([FromQuery] MeasurementQuery q)
	{
		var query = _db.Measurements.AsNoTracking();
		if (q.MinId is not null) query = query.Where(m => m.MeasurementId >= q.MinId);
		if (q.MaxId is not null) query = query.Where(m => m.MeasurementId <= q.MaxId);
		if (q.DeviceId is not null) query = query.Where(m => m.DeviceId == q.DeviceId);
		if (q.SampleId is not null) query = query.Where(m => m.SampleId == q.SampleId);
		if (q.EquipmentId is not null) query = query.Where(m => m.EquipmentId == q.EquipmentId);
		if (q.UserId is not null) query = query.Where(m => m.UserId == q.UserId);
		if (q.MeasurementType is not null) query = query.Where(m => m.MeasurementType == q.MeasurementType);
		if (q.MeasuredAtFrom is not null) query = query.Where(m => m.MeasuredAt >= q.MeasuredAtFrom);
		if (q.MeasuredAtTo is not null) query = query.Where(m => m.MeasuredAt <= q.MeasuredAtTo);
		if (q.MinTemperatureK is not null) query = query.Where(m => m.TemperatureK >= q.MinTemperatureK);
		if (q.MaxTemperatureK is not null) query = query.Where(m => m.TemperatureK <= q.MaxTemperatureK);
		if (q.MinHumidityPercent is not null) query = query.Where(m => m.HumidityPercent >= q.MinHumidityPercent);
		if (q.MaxHumidityPercent is not null) query = query.Where(m => m.HumidityPercent <= q.MaxHumidityPercent);
		query = query.OrderBy(m => m.MeasurementId);
		return Ok(await query
				.Select(m => new MeasurementResponse(
					m.MeasurementId, m.DeviceId, m.SampleId, m.EquipmentId, m.UserId,
					m.MeasurementType, m.MeasuredAt, m.TemperatureK, m.HumidityPercent,
					m.Notes, m.DataFilePath
				))
				.ToListAsync());
		
	}
	 		// Ok(await _db.Measurements
            //         .Select(m => new MeasurementResponse(
			// 		    m.MeasurementId, m.DeviceId, m.SampleId, m.EquipmentId, m.UserId,
			// 		    m.MeasurementType, m.MeasuredAt, m.TemperatureK, m.HumidityPercent,
			// 		    m.Notes, m.DataFilePath))
			// 		.ToListAsync());

	[HttpGet("{id:int}")]
	public async Task<IActionResult> GetById(int id)
	{
		var measurement = await _db.Measurements.FindAsync(id);
		return measurement is null
		       ? NotFound()
		       : Ok( new MeasurementResponse(
			    measurement.MeasurementId, measurement.DeviceId, measurement.SampleId, measurement.EquipmentId, measurement.UserId,
			    measurement.MeasurementType, measurement.MeasuredAt, measurement.TemperatureK, measurement.HumidityPercent,
			    measurement.Notes, measurement.DataFilePath));
	}

	[HttpPost]
	public async Task<IActionResult> Create(CreateMeasurementRequest req)
	{
		// 1. Exactly one must be provided (check nullability only)
        if (req.DeviceId.HasValue == req.SampleId.HasValue)
        return BadRequest("Exactly one of device_id or sample_id must be provided. The other must be null.");

        // 2. The provided one must exist in DB
        bool refExists = req.DeviceId.HasValue
            ? await _db.Devices.AnyAsync(d => d.DeviceId == req.DeviceId.Value)
            : await _db.Samples.AnyAsync(s => s.SampleId == req.SampleId!.Value);// null forgiving operator
        if (!refExists)
            return BadRequest("The specified device or sample does not exist.");

		var measurement = new Measurement
		{
			DeviceId = req.DeviceId,
			SampleId = req.SampleId,
			EquipmentId = req.EquipmentId,
			UserId = req.UserId,
			MeasurementType = req.MeasurementType,
			MeasuredAt = req.MeasuredAt,
			TemperatureK = req.TemperatureK,
			HumidityPercent = req.HumidityPercent,
			Notes = req.Notes,
			DataFilePath = req.DataFilePath
		};
		_db.Measurements.Add(measurement);
		try
		{
			await _db.SaveChangesAsync();
		}
		catch (DbUpdateException ex) when (ex.InnerException?.Message.Contains("23503") == true)
		{
			return BadRequest($"Device with id {req.DeviceId} or sample with id {req.SampleId} " +
					  $"equipment with id {req.EquipmentId} user with id {req.UserId}" +
					  " does not exist.");
		};

		return CreatedAtAction(nameof(GetById), new { id = measurement.MeasurementId},
            new MeasurementResponse(
			    measurement.MeasurementId, measurement.DeviceId, measurement.SampleId, measurement.EquipmentId, measurement.UserId,
			    measurement.MeasurementType, measurement.MeasuredAt, measurement.TemperatureK, measurement.HumidityPercent,
			    measurement.Notes, measurement.DataFilePath));
	}

	[HttpPut("{id:int}")]
	public async Task<IActionResult> Update(int id, UpdateMeasurementRequest req)
	{
		// 1. Exactly one must be provided (check nullability only)
        if (req.DeviceId.HasValue == req.SampleId.HasValue)
        return BadRequest("Exactly one of device_id or sample_id must be provided.  The other must be null.");

        // 2. The provided one must exist in DB
        bool refExists = req.DeviceId.HasValue
            ? await _db.Devices.AnyAsync(d => d.DeviceId == req.DeviceId.Value)
            : await _db.Samples.AnyAsync(s => s.SampleId == req.SampleId!.Value);// null forgiving operator
        if (!refExists)
            return BadRequest("The specified device or sample does not exist.");


		var measurement = await _db.Measurements.FindAsync(id);
		if (measurement is null) return NotFound();

		measurement.DeviceId = req.DeviceId;
		measurement.SampleId = req.SampleId;
		measurement.EquipmentId = req.EquipmentId;
		measurement.UserId = req.UserId;
		measurement.MeasurementType = req.MeasurementType;
		measurement.MeasuredAt = req.MeasuredAt;
		measurement.TemperatureK = req.TemperatureK;
		measurement.HumidityPercent = req.HumidityPercent;
		measurement.Notes = req.Notes;
		measurement.DataFilePath = req.DataFilePath;

		try
		{
			await _db.SaveChangesAsync();
		}
		catch (DbUpdateException ex) when (ex.InnerException?.Message.Contains("23503") == true)
		{
			return BadRequest($"Device with id {req.DeviceId} or sample with id {req.SampleId} " +
					  $"equipment with id {req.EquipmentId} user with id {req.UserId}" +
					  " does not exist.");
		};

		return Ok(new MeasurementResponse(
			    measurement.MeasurementId, measurement.DeviceId, measurement.SampleId, measurement.EquipmentId, measurement.UserId,
			    measurement.MeasurementType, measurement.MeasuredAt, measurement.TemperatureK, measurement.HumidityPercent,
			    measurement.Notes, measurement.DataFilePath));
	}

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var measurement = await _db.Measurements.FindAsync(id);
        if (measurement is null) return NotFound();
        _db.Measurements.Remove(measurement);
        await _db.SaveChangesAsync();
        return NoContent();
    }

}