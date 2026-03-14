using DataManagement.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DataManagement.Data.Configurations;
public class SampleConfiguration : IEntityTypeConfiguration<Sample>
{
    public void Configure(EntityTypeBuilder<Sample> entity)
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
            .IsRequired(false)
            .OnDelete(DeleteBehavior.SetNull);
        entity.Property(s => s.CreatedAt)
            .HasColumnName("created_at")
            .HasDefaultValueSql("NOW()");
    }
}