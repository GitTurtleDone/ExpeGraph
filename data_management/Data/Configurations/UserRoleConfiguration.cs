using DataManagement.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DataManagement.Data.Configurations;

public class UserRoleConfiguration : IEntityTypeConfiguration<UserRole>
{
    public void Configure(EntityTypeBuilder<UserRole> entity)
    {
        entity.ToTable("users_roles");
        entity.HasKey(ur => new { ur.UserId, ur.RoleId });
        entity.Property(ur => ur.UserId).HasColumnName("user_id");
        entity.Property(ur => ur.RoleId).HasColumnName("role_id");
        entity.Property(ur => ur.RoleStartDate).HasColumnName("role_start_date");
        entity.Property(ur => ur.RoleEndDate).HasColumnName("role_end_date");
        entity.HasOne(ur => ur.User)
            .WithMany(u => u.UserRoles)
            .HasForeignKey(ur => ur.UserId)
            .OnDelete(DeleteBehavior.Cascade);
        entity.HasOne(ur => ur.Role)
            .WithMany(r => r.UserRoles)
            .HasForeignKey(ur => ur.RoleId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}