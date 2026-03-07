using DataManagement.Models;
using Microsoft.EntityFrameworkCore;

namespace DataManagement.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Batch> Batches => Set<Batch>();
    public DbSet<Sample> Samples => Set<Sample>();
    public DbSet<Device> Devices => Set<Device>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasDefaultSchema("expegraph");

        modelBuilder.Entity<Batch>(entity =>
        {
            entity.ToTable("batches");
            entity.HasKey(b => b.BatchId);

            entity.Property(b => b.BatchId).HasColumnName("batch_id");
            entity.Property(b => b.BatchName)
                  .HasColumnName("batch_name")
                  .IsRequired()
                  .HasMaxLength(100);
            entity.HasIndex(b => b.BatchName).IsUnique();
            entity.Property(b => b.Description).HasColumnName("description");
            entity.Property(b => b.FabricationDate)
                  .HasColumnName("fabrication_date")
                  .IsRequired();
            entity.Property(b => b.Treatment).HasColumnName("treatment");
            entity.Property(b => b.ProjectId).HasColumnName("project_id");
            entity.Property(b => b.LabId).HasColumnName("lab_id");
            entity.Property(b => b.CreatedAt)
                  .HasColumnName("created_at")
                  .HasDefaultValueSql("NOW()");
        });
        
        modelBuilder.Entity<Sample>(entity =>
        {
            entity.ToTable("samples");
            entity.HasKey(s => s.SampleId);
            entity.Property(s => s.SampleId).HasColumnName("sample_id");
            entity.Property(s => s.SampleName)
                .HasColumnName("sample_name")
                .IsRequired()
                .HasMaxLength(50);
            entity.Property(s => s.Description).HasColumnName("description");
            entity.Property(s => s.Treatment).HasColumnName("treatment");
            entity.Property(s => s.Properties).HasColumnName("properties").HasColumnType("jsonb");
            entity.Property(s => s.BatchId).HasColumnName("batch_id");
            entity.HasOne(s => s.Batch)
                .WithMany(b => b.Samples)
                .HasForeignKey(s => s.BatchId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.Property(s => s.CreatedAt)
                .HasColumnName("created_at")
                .HasDefaultValueSql("NOW()");   
        });

        modelBuilder.Entity<Device>(entity =>
        {	
            entity.ToTable("devices");
            entity.HasKey(d => d.DeviceId);
            entity.Property(d => d.DeviceId).HasColumnName("device_id");
            entity.Property(d => d.DeviceName)
                .HasColumnName("device_name")
                .IsRequired()
                .HasMaxLength(50);
            entity.Property(d => d.DeviceType)
                .HasColumnName("device_type")
                .IsRequired()
                .HasMaxLength(50);
            entity.Property(d => d.SampleId).HasColumnName("sample_id");
            entity.HasOne(d => d.Sample)
                .WithMany(s => s.Devices)
                .HasForeignKey(d => d.SampleId)
                .OnDelete(DeleteBehavior.Cascade);
        });


    }
}
