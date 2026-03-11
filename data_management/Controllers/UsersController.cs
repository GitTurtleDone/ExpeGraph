using DataManagement.Data;
using DataManagement.Dtos;
using DataManagement.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;

namespace DataManagement.Controllers;

[ApiController]
[Route("[controller]")]
public class UsersController : ControllerBase
{
    private readonly AppDbContext _db;
    public UsersController(AppDbContext db)
    {
        _db = db;
    }
    
    //GET users/
    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await _db.Users
                .Select(u => new UserResponse(
                    u.UserId, u.Username, u.Email, u.FirstName, u.LastName,
                    u.IsActive, u.CreatedAt, u.LastLoginAt))
                .ToListAsync());
    
    //GET users/id
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var user = await _db.Users.FindAsync(id);
        if (user is null) return NotFound($"User with id {id} is not found.");
        return Ok(new UserResponse(
            user.UserId, user.Username, user.Email, user.FirstName, user.LastName,
            user.IsActive, user.CreatedAt, user.LastLoginAt)); 
    }
    //POST users/
    [HttpPost]
    public async Task<IActionResult> Create(CreateUserRequest req)
    {
        var user = new User
        {
            Username = req.Username,
            Email = req.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.Password),
            FirstName = req.FirstName,
            LastName = req.LastName
        };
        _db.Users.Add(user);
        try
        {
            await _db.SaveChangesAsync();
        }
        catch (DbUpdateException ex) when (ex.InnerException?.Message.Contains("23505") == true)
        {
            return Conflict("Username or email already exists.");
        }
        catch (DbUpdateException ex)
        {
            return StatusCode(500, $"An error occurred while saving data: {ex.Message}");
        }
        return CreatedAtAction(nameof(GetById), new { id = user.UserId }, new UserResponse(
            user.UserId, user.Username, user.Email, user.FirstName, user.LastName,
            user.IsActive, user.CreatedAt, user.LastLoginAt));
    }
    //PUT users/id
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, UpdateUserRequest req)
    {
        var user = await _db.Users.FindAsync(id);
        if (user is null) return NotFound($"User with id {id} is not found.");
        user.Username = req.Username;
        user.Email = req.Email;
        if (!string.IsNullOrEmpty(req.Password))
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.Password);
        user.FirstName = req.FirstName;
        user.LastName = req.LastName;
        try
        {
            await _db.SaveChangesAsync();
        }
        catch (DbUpdateException ex) when (ex.InnerException?.Message.Contains("23505") == true)
        {
            return Conflict("Username or email already exists.");
        }
        catch (DbUpdateException ex)
        {
            return StatusCode(500, $"An error occurred while saving data: {ex.Message}");
        }
        return Ok(new UserResponse(
            user.UserId, user.Username, user.Email, user.FirstName, user.LastName,
            user.IsActive, user.CreatedAt, user.LastLoginAt));
    }
    //DELETE users/id
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var user = await _db.Users.FindAsync(id);
        if (user is null) return NotFound($"User with id {id} is not found.");
        _db.Users.Remove(user);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
