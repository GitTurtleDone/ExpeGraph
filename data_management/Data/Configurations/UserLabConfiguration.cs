using DataManagement.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DataManagement.Data.Configurations;

public class UserLabConfiguration : IEntityTypeConfiguration<UserLab>
{
    public void Configure(EntityTypeBuilder<UserLab> entity)
    {
        entity.ToTable("users_labs");
        entity.HasKey(ul => new {ul.UserId, ul.LabId});
        entity.Property(ul => ul.UserId).HasColumnName("user_id");
        entity.Property(ul => ul.LabId).HasColumnName("lab_id");
        entity.Property(ul => ul.Role)
            .HasColumnName("role")
            .IsRequired()
            .HasMaxLength(20)
            .HasDefaultValue("member");
        entity.ToTable(t => t.HasCheckConstraint("CK_users_labs_role", 
                "role IN ('leader', 'deputy_leader', 'member', 'student')"));
        entity.Property(ul => ul.JoinedAt)
            .HasColumnName("joined_at")
            .IsRequired()
            .HasDefaultValueSql("NOW()");
        entity.HasOne(ul => ul.User).WithMany(u => u.UserLabs)
            .HasForeignKey(ul => ul.UserId)
            .OnDelete(DeleteBehavior.Cascade);
        entity.HasOne(ul => ul.Lab).WithMany(l => l.UserLabs)
            .HasForeignKey(ul => ul.LabId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}