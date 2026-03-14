using DataManagement.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DataManagement.Data.Configurations;

public class TlmConfiguration : IEntityTypeConfiguration<Tlm>
{
    public void Configure(EntityTypeBuilder<Tlm> entity)
    {
        entity.ToTable("tlms");
        entity.HasKey(t => t.TlmId);
        entity.Property(t => t.TlmId).HasColumnName("tlm_id");
        entity.Property(t => t.GeometryType)
            .HasColumnName("geometry_type")
            .IsRequired()
            .HasMaxLength(20);
        entity.ToTable(t => t.HasCheckConstraint(
            "CK_tlms_geometry_type",
            "geometry_type IN ('rectangular', 'circular', 'other')"));
        entity.Property(t => t.SheetResistanceOhmSq).HasColumnName("sheet_resistance_ohm_sq");
        entity.Property(t => t.ContactResistanceOhm).HasColumnName("contact_resistance_ohm");
        entity.Property(t => t.TransferLengthCm).HasColumnName("transfer_length_cm");
    }
}