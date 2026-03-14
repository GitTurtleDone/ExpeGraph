using DataManagement.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DataManagement.Data.Configurations;

public class LabProjectConfiguration : IEntityTypeConfiguration<LabProject>
{
    public void Configure(EntityTypeBuilder<LabProject> entity)
    {
        entity.ToTable("labs_projects");
        entity.HasKey(lp => new { lp.LabId, lp.ProjectId });
        entity.Property(lp => lp.LabId).HasColumnName("lab_id");
        entity.Property(lp => lp.ProjectId).HasColumnName("project_id");
        entity.HasOne(lp => lp.Lab)
            .WithMany(l => l.LabProjects)
            .HasForeignKey(lp => lp.LabId)
            .OnDelete(DeleteBehavior.Cascade);
        entity.HasOne(lp => lp.Project)
            .WithMany(p => p.LabProjects)
            .HasForeignKey(lp => lp.ProjectId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}