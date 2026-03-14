using DataManagement.Controllers;
using DataManagement.Models;
using Microsoft.EntityFrameworkCore;
using System.Reflection;

namespace DataManagement.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
    public DbSet<Batch> Batches => Set<Batch>();
    public DbSet<Sample> Samples => Set<Sample>();
    public DbSet<Device> Devices => Set<Device>();
    public DbSet<Measurement> Measurements => Set<Measurement>();
    public DbSet<Project> Projects => Set<Project>();
    public DbSet<User> Users => Set<User>();
    public DbSet<UserProject> UserProjects => Set<UserProject>();
    public DbSet<Lab> Labs => Set<Lab>();
    public DbSet<UserLab> UserLabs => Set<UserLab>();
    public DbSet<Role> Roles => Set<Role>();
    public DbSet<Permission> Permissions => Set<Permission>();
    public DbSet<Equipment> Equipment => Set<Equipment>();
    public DbSet<Tlm> Tlms => Set<Tlm>();
    public DbSet<LabProject> LabProjects => Set<LabProject>();
    public DbSet<UserRole> UserRoles => Set<UserRole>();
    public DbSet<RolePermission> RolePermissions => Set<RolePermission>();
    public DbSet<LabEquipment> LabEquipments => Set<LabEquipment>();
    public DbSet<DeviceParameter> DeviceParameters => Set<DeviceParameter>();
    public DbSet<Diode> Diodes => Set<Diode>();
    public DbSet<Transistor> Transistors => Set<Transistor>();
    public DbSet<Resistor> Resistors => Set<Resistor>();
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasDefaultSchema("expegraph");
        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
    }
}
