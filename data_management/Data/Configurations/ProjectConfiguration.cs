using DataManagement.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DataManagement.Data.Configurations;

public class ProjectConfiguration : IEntityTypeConfiguration<Project>
{
	public void Configure(EntityTypeBuilder<Project> entity)
	{	
		entity.ToTable("projects");
		entity.HasKey(p => p.ProjectId);
		entity.Property(p => p.ProjectId).HasColumnName("project_id");
		entity.Property(p => p.ProjectName)
			.HasColumnName("project_name")
			.IsRequired();
		entity.Property(p => p.Description).HasColumnName("description");
		entity.Property(p => p.Funding).HasColumnName("funding");
		entity.Property(p => p.StartDate).HasColumnName("start_date");
		entity.Property(p => p.EndDate).HasColumnName("end_date");
		entity.Property(p => p.CreatedAt)
			.HasColumnName("created_at")
			.IsRequired()
			.HasDefaultValueSql("NOW()");
	}
}