using DataManagement.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DataManagement.Data.Configurations;

public class LabConfiguration : IEntityTypeConfiguration<Lab>
{
    public void Configure(EntityTypeBuilder<Lab> entity)
    {
        entity.ToTable("labs");
        entity.HasKey(l => l.LabId);
        entity.Property(l => l.LabId).HasColumnName("lab_id");
        entity.Property(l => l.LabName)
            .HasColumnName("lab_name")
            .IsRequired()
            .HasMaxLength(100);
        entity.HasIndex(l => l.LabName).IsUnique();
        entity.Property(l => l.Description).HasColumnName("description");
        entity.Property(l => l.LabLeaderId)
            .HasColumnName("lab_leader_id");
        entity.HasOne<User>()
            .WithMany()
            .HasForeignKey(l => l.LabLeaderId)
            .OnDelete(DeleteBehavior.SetNull);
        entity.Property(l => l.CreatedAt)
            .HasColumnName("created_at")
            .IsRequired()
            .HasDefaultValueSql("NOW()");
    }
}