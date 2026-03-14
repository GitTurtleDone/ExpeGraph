using DataManagement.Data;
using DataManagement.Dtos;
using DataManagement.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DataManagement.Controllers;

[ApiController]
[Route("[controller]")]
public class DeviceParametersController : ControllerBase
{
    private readonly AppDbContext _db;
    public DeviceParametersController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult> GetAll() =>
        Ok(await _db.DeviceParameters.Select(dp => new DeviceParameterResponse(
            dp.DeviceParameterId, dp.DeviceId, dp.Key, dp.Value)).ToListAsync());

    [HttpGet("{id}")]
    public async Task<ActionResult> GetById(int id)
    {
        var dp = await _db.DeviceParameters.FindAsync(id);
        return dp is null
            ? NotFound($"Device parameter with id {id} not found.")
            : Ok(new DeviceParameterResponse(dp.DeviceParameterId, dp.DeviceId, dp.Key, dp.Value));
    }

    [HttpPost]
    public async Task<ActionResult> Create(CreateDeviceParameterRequest req)
    {
        var dp = new DeviceParameter { DeviceId = req.DeviceId, Key = req.Key, Value = req.Value };
        _db.DeviceParameters.Add(dp);
        try { await _db.SaveChangesAsync(); }
        catch (DbUpdateException ex) when (ex.InnerException?.Message.Contains("23503") == true)
        {
            return NotFound($"Device with id {req.DeviceId} does not exist.");
        }
        catch (DbUpdateException ex) when (ex.InnerException?.Message.Contains("23505") == true)
        {
            return Conflict($"Device {req.DeviceId} already has a parameter with key '{req.Key}'.");
        }
        return CreatedAtAction(nameof(GetById), new { id = dp.DeviceParameterId },
            new DeviceParameterResponse(dp.DeviceParameterId, dp.DeviceId, dp.Key, dp.Value));
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> Update(int id, UpdateDeviceParameterRequest req)
    {
        var dp = await _db.DeviceParameters.FindAsync(id);
        if (dp is null) return NotFound($"Device parameter with id {id} not found.");
        dp.Value = req.Value;
        await _db.SaveChangesAsync();
        return Ok(new DeviceParameterResponse(dp.DeviceParameterId, dp.DeviceId, dp.Key, dp.Value));
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
        var dp = await _db.DeviceParameters.FindAsync(id);
        if (dp is null) return NotFound($"Device parameter with id {id} not found.");
        _db.DeviceParameters.Remove(dp);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}