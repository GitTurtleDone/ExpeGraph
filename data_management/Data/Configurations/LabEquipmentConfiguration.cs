using DataManagement.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DataManagement.Data.Configurations;

public class LabEquipmentConfiguration : IEntityTypeConfiguration<LabEquipment>
{
    public void Configure(EntityTypeBuilder<LabEquipment> entity)
    {
        entity.ToTable("labs_equipment");
        entity.HasKey(le => new { le.LabId, le.EquipmentId });
        entity.Property(le => le.LabId).HasColumnName("lab_id");
        entity.Property(le => le.EquipmentId).HasColumnName("equipment_id");
        entity.HasOne(le => le.Lab)
            .WithMany(l => l.LabEquipments)
            .HasForeignKey(le => le.LabId)
            .OnDelete(DeleteBehavior.Cascade);
        entity.HasOne(le => le.Equipment)
            .WithMany(e => e.LabEquipments)
            .HasForeignKey(le => le.EquipmentId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}