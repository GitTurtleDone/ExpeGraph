using DataManagement.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DataManagement.Data.Configurations;

public class ResistorConfiguration : IEntityTypeConfiguration<Resistor>
{
    public void Configure(EntityTypeBuilder<Resistor> entity)
    {
        entity.ToTable("resistors");
        entity.HasKey(r => r.ResistorId);
        entity.Property(r => r.ResistorId).HasColumnName("resistor_id").ValueGeneratedNever();
        entity.Property(r => r.GeometryType)
            .HasColumnName("geometry_type")
            .IsRequired()
            .HasMaxLength(20);
        entity.ToTable(t => t.HasCheckConstraint(
            "CK_resistors_geometry_type",
            "geometry_type IN ('rectangular', 'circular', 'other')"));
        entity.Property(r => r.WidthUm).HasColumnName("width_um");
        entity.Property(r => r.GapUm).HasColumnName("gap_um");
        entity.Property(r => r.InnerRadiusUm).HasColumnName("inner_radius_um");
        entity.Property(r => r.OuterRadiusUm).HasColumnName("outer_radius_um");
        entity.Property(r => r.GeometryProperties)
            .HasColumnName("geometry_properties")
            .HasColumnType("jsonb");
        entity.Property(r => r.ResistanceOhm).HasColumnName("resistance_ohm");
        entity.Property(r => r.TlmId).HasColumnName("tlm_id");
        entity.HasOne(r => r.Tlm)
            .WithMany(t => t.Resistors)
            .HasForeignKey(r => r.TlmId)
            .OnDelete(DeleteBehavior.SetNull);
        entity.HasOne(r => r.Device)
            .WithOne()
            .HasForeignKey<Resistor>(r => r.ResistorId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}