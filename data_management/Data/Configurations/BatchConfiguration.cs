using DataManagement.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DataManagement.Data.Configurations;

public class BatchConfiguration : IEntityTypeConfiguration<Batch>
{
    public void Configure(EntityTypeBuilder<Batch> entity)
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
        entity.HasOne<Project>()
            .WithMany()
            .HasForeignKey(b => b.ProjectId)
            .OnDelete(DeleteBehavior.SetNull);
        entity.HasOne<Lab>()
            .WithMany()
            .HasForeignKey(b => b.LabId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}