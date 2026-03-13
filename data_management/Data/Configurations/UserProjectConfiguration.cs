using DataManagement.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DataManagement.Data.Configurations;

public class UserProjectConfiguration : IEntityTypeConfiguration<UserProject>
{
    public void Configure(EntityTypeBuilder<UserProject> entity)
    {
        entity.ToTable("users_projects");

        entity.HasKey(up => new { up.UserId, up.ProjectId });

        entity.Property(up => up.UserId).HasColumnName("user_id");
        entity.Property(up => up.ProjectId).HasColumnName("project_id");
        entity.Property(up => up.Role)
            .HasColumnName("role")
            .HasMaxLength(50);
        entity.Property(up => up.JoinedAt)
            .HasColumnName("joined_at")
            .IsRequired()
            .HasDefaultValueSql("NOW()");
        
        entity.HasOne(up => up.User)
            .WithMany(u => u.UserProjects)
            .HasForeignKey(up => up.UserId);
        entity.HasOne(up => up.Project)
            .WithMany(p => p.UserProjects)
            .HasForeignKey(up => up.ProjectId);
    }
}
