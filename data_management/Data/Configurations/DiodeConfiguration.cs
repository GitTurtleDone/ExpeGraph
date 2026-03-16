using DataManagement.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DataManagement.Data.Configurations;

public class DiodeConfiguration : IEntityTypeConfiguration<Diode>
{
    public void Configure(EntityTypeBuilder<Diode> entity)
    {
        entity.ToTable("diodes");
        entity.HasKey(d => d.DiodeId);
        entity.Property(d => d.DiodeId).HasColumnName("diode_id").ValueGeneratedNever();
        entity.Property(d => d.GeometryType)
            .HasColumnName("geometry_type")
            .IsRequired()
            .HasMaxLength(20);
        entity.ToTable(t => t.HasCheckConstraint(
            "CK_diodes_geometry_type",
            "geometry_type IN ('rectangular', 'circular', 'other')"));
        entity.Property(d => d.AnodeWidthUm).HasColumnName("anode_width_um");
        entity.Property(d => d.AnodeLengthUm).HasColumnName("anode_length_um");
        entity.Property(d => d.ChamferRadiusUm).HasColumnName("chamfer_radius_um");
        entity.Property(d => d.AnodeRadiusUm).HasColumnName("anode_radius_um");
        entity.Property(d => d.GeometryProperties)
            .HasColumnName("geometry_properties")
            .HasColumnType("jsonb");
        entity.Property(d => d.BarrierHeightEv).HasColumnName("barrier_height_ev");
        entity.Property(d => d.IdealityFactor).HasColumnName("ideality_factor");
        entity.Property(d => d.RecRatio).HasColumnName("rec_ratio");
        entity.Property(d => d.BuiltInPotentialV).HasColumnName("built_in_potential_v");
        entity.Property(d => d.CarrierConcentration).HasColumnName("carrier_concentration");
        entity.Property(d => d.MaxCurrentA).HasColumnName("max_current_a");
        entity.Property(d => d.VoltageAtMaxCurrentV).HasColumnName("voltage_at_max_current_v");
        entity.Property(d => d.BreakdownVoltageV).HasColumnName("breakdown_voltage_v");
        entity.HasOne(d => d.Device)
            .WithOne()
            .HasForeignKey<Diode>(d => d.DiodeId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}