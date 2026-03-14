using DataManagement.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DataManagement.Data.Configurations;

public class EquipmentConfiguration : IEntityTypeConfiguration<Equipment>
{
    public void Configure(EntityTypeBuilder<Equipment> entity)
    {
        entity.ToTable("equipment");
        entity.HasKey(e => e.EquipmentId);
        entity.Property(e => e.EquipmentId).HasColumnName("equipment_id");
        entity.Property(e => e.EquipmentName)
            .HasColumnName("equipment_name")
            .IsRequired()
            .HasMaxLength(100);
        entity.Property(e => e.Manufacturer)
            .HasColumnName("manufacturer")
            .HasMaxLength(100);
        entity.Property(e => e.Model)
            .HasColumnName("model")
            .HasMaxLength(100);
        entity.Property(e => e.SerialNumber)
            .HasColumnName("serial_number")
            .HasMaxLength(100);
        entity.HasIndex(e => e.SerialNumber).IsUnique();
        entity.Property(e => e.PurchaseYear).HasColumnName("purchase_year");
        entity.Property(e => e.CalibrationDue).HasColumnName("calibration_due");
        entity.Property(e => e.Location)
            .HasColumnName("location")
            .HasMaxLength(100);
        entity.Property(e => e.ConnectingStr).HasColumnName("connecting_str");
        entity.Property(e => e.Notes).HasColumnName("notes");
    }
}