using DataManagement.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DataManagement.Data.Configurations;

public class DeviceConfiguration : IEntityTypeConfiguration<Device>
{
    public void Configure(EntityTypeBuilder<Device> entity)
    {
        entity.ToTable("devices");
        entity.HasKey(d => d.DeviceId);
        entity.Property(d => d.DeviceId).HasColumnName("device_id");
        entity.Property(d => d.DeviceName)
            .HasColumnName("device_name")
            .IsRequired()
            .HasMaxLength(50);
        entity.Property(d => d.DeviceType)
            .HasColumnName("device_type")
            .IsRequired()
            .HasMaxLength(50);
        entity.Property(d => d.SampleId).HasColumnName("sample_id");
        entity.HasOne(d => d.Sample)
            .WithMany(s => s.Devices)
            .HasForeignKey(d => d.SampleId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}