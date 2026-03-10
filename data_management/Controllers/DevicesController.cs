using DataManagement.Models;
using DataManagement.Data;
using DataManagement.Dtos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DataManagement.Controllers;

[ApiController]
[Route("[controller]")]
public class DevicesController: ControllerBase
{
	private readonly AppDbContext _db;
	public DevicesController(AppDbContext db)
	{
		_db = db;
	}
	[HttpGet]
	public async Task<IActionResult> GetAll() =>
       Ok(await _db.Devices
                .Select(d => new DeviceResponse(
                d.DeviceId, d.DeviceName, d.DeviceType, d.SampleId))
                .ToListAsync());
	[HttpGet("{id:int}")]
	public async Task<IActionResult> GetById(int id)
	{
		var device = await _db.Devices.FindAsync(id);
		return device is null
            ? NotFound()
            : Ok(new DeviceResponse(
			device.DeviceId, device.DeviceName, device.DeviceType, device.SampleId));
	}
	
	[HttpPost]
	public async Task<IActionResult> Create(CreateDeviceRequest req)
	{
		if (!await _db.Samples.AnyAsync(s => s.SampleId == req.SampleId))
			return BadRequest($"Sample with id {req.SampleId} does not exist.");

		var device = new Device
        {
            DeviceName = req.DeviceName,
			DeviceType = req.DeviceType,
			SampleId = req.SampleId
        };
		_db.Devices.Add(device);
		await _db.SaveChangesAsync();

		return CreatedAtAction(nameof(GetById), new { id = device.DeviceId }, new DeviceResponse(
		       device.DeviceId, device.DeviceName, device.DeviceType, device.SampleId));
	}

	[HttpPut("{id:int}")]
	public async Task<IActionResult> Update(int id, UpdateDeviceRequest req)
	{
		if (!await _db.Samples.AnyAsync(s => s.SampleId == req.SampleId))
			return BadRequest($"Sample with id {req.SampleId} does not exist.");

		var device = await _db.Devices.FindAsync(id);
		if (device is null) return NotFound();
		device.DeviceName = req.DeviceName;
		device.DeviceType = req.DeviceType;
		device.SampleId = req.SampleId;
		await _db.SaveChangesAsync();
        return Ok(new DeviceResponse(
            device.DeviceId, device.DeviceName, device.DeviceType, device.SampleId
        ));
	}
	[HttpDelete("{id:int}")]
	public async Task<IActionResult> Delete(int id)
	{
		var device = await _db.Devices.FindAsync(id);
		if (device is null) return NotFound();
		_db.Devices.Remove(device);
        await _db.SaveChangesAsync();
		return NoContent();
	}
	
}