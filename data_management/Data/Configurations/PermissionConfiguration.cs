using DataManagement.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DataManagement.Data.Configurations;

public class PermissionConfiguration : IEntityTypeConfiguration<Permission>
{
    public void Configure(EntityTypeBuilder<Permission> entity)
    {
        entity.ToTable("permissions");
        entity.HasKey(p => p.PermissionId);
        entity.Property(p => p.PermissionId).HasColumnName("permission_id");
        entity.Property(p => p.PermissionName)
            .HasColumnName("permission_name")
            .IsRequired()
            .HasMaxLength(100);
        entity.HasIndex(p => p.PermissionName).IsUnique();
        entity.Property(p => p.Description).HasColumnName("description");
    }
}