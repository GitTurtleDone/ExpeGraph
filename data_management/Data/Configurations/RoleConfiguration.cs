using DataManagement.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DataManagement.Data.Configurations;

public class RoleConfiguration : IEntityTypeConfiguration<Role>
{
    public void Configure(EntityTypeBuilder<Role> entity)
    {
        entity.ToTable("roles");
        entity.HasKey(r => r.RoleId);
        entity.Property(r => r.RoleId).HasColumnName("role_id");
        entity.Property(r => r.RoleName)
            .HasColumnName("role_name")
            .IsRequired()
            .HasMaxLength(50);
        entity.HasIndex(r => r.RoleName).IsUnique();
        entity.Property(r => r.Description).HasColumnName("description");
    }
}