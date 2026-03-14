using DataManagement.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DataManagement.Data.Configurations;

public class DeviceParameterConfiguration : IEntityTypeConfiguration<DeviceParameter>
{
    public void Configure(EntityTypeBuilder<DeviceParameter> entity)
    {
        entity.ToTable("device_parameters");
        entity.HasKey(dp => dp.DeviceParameterId);
        entity.Property(dp => dp.DeviceParameterId).HasColumnName("device_parameter_id");
        entity.Property(dp => dp.DeviceId).HasColumnName("device_id").IsRequired();
        entity.Property(dp => dp.Key)
            .HasColumnName("key")
            .IsRequired()
            .HasMaxLength(100);
        entity.Property(dp => dp.Value).HasColumnName("value");
        entity.HasIndex(dp => new { dp.DeviceId, dp.Key }).IsUnique();
        entity.HasOne(dp => dp.Device)
            .WithMany(d => d.DeviceParameters)
            .HasForeignKey(dp => dp.DeviceId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}