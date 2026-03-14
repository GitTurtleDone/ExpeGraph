using DataManagement.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DataManagement.Data.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> entity)
    {
        entity.ToTable("users");
        entity.HasKey(u => u.UserId);
        entity.Property(u => u.UserId).HasColumnName("user_id");
        entity.Property(u => u.Username)
            .HasColumnName("username")
            .IsRequired()
            .HasMaxLength(50);
        entity.HasIndex(u => u.Username).IsUnique();
        entity.Property(u => u.Email)
            .HasColumnName("email")
            .IsRequired()
            .HasMaxLength(255);
        entity.HasIndex(u => u.Email).IsUnique();
        entity.Property(u => u.PasswordHash)
            .HasColumnName("password_hash")
            .IsRequired()
            .HasMaxLength(255);
        entity.Property(u => u.FirstName)
            .HasColumnName("first_name")
            .HasMaxLength(50);
        entity.Property(u => u.LastName)
            .HasColumnName("last_name")
            .HasMaxLength(50);
        entity.Property(u => u.IsActive)
            .HasColumnName("is_active")
            .IsRequired()
            .HasDefaultValueSql("TRUE");
        entity.Property(u => u.CreatedAt)
            .HasColumnName("created_at")
            .IsRequired()
            .HasDefaultValueSql("NOW()");
        entity.Property(u => u.LastLoginAt).HasColumnName("last_login_at");
    }
}