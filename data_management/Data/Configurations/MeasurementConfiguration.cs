using DataManagement.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DataManagement.Data.Configurations;

public class MeasurementConfiguration : IEntityTypeConfiguration<Measurement>
{
    public void Configure(EntityTypeBuilder<Measurement> entity)
    {
        entity.ToTable("measurements");
        entity.HasKey(m => m.MeasurementId);
        entity.Property(m => m.MeasurementId).HasColumnName("measurement_id");
        entity.Property(m => m.DeviceId).HasColumnName("device_id");
        entity.Property(m => m.SampleId).HasColumnName("sample_id");
        entity.Property(m => m.EquipmentId).HasColumnName("equipment_id");
        entity.Property(m => m.UserId).HasColumnName("user_id");
        entity.Property(m => m.MeasurementType)
            .HasColumnName("measurement_type")
            .IsRequired()
            .HasMaxLength(50); 
        entity.Property(m => m.MeasuredAt)
            .HasColumnName("measured_at")
            .IsRequired()
            .HasDefaultValueSql("NOW()");
        entity.Property(m => m.TemperatureK).HasColumnName("temperature_k");
        entity.Property(m => m.HumidityPercent).HasColumnName("humidity_percent");
        entity.Property(m => m.Notes).HasColumnName("notes");
        entity.Property(m => m.DataFilePath)
            .HasColumnName("data_file_path")
            .IsRequired();
    }
}