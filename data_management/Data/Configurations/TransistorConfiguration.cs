using DataManagement.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DataManagement.Data.Configurations;

public class TransistorConfiguration : IEntityTypeConfiguration<Transistor>
{
    public void Configure(EntityTypeBuilder<Transistor> entity)
    {
        entity.ToTable("transistors");
        entity.HasKey(t => t.TransistorId);
        entity.Property(t => t.TransistorId).HasColumnName("transistor_id").ValueGeneratedNever();
        entity.Property(t => t.GeometryType)
            .HasColumnName("geometry_type")
            .IsRequired()
            .HasMaxLength(20);
        entity.ToTable(t => t.HasCheckConstraint(
            "CK_transistors_geometry_type",
            "geometry_type IN ('rectangular', 'circular', 'other')"));
        entity.Property(t => t.GateWidthUm).HasColumnName("gate_width_um");
        entity.Property(t => t.GateLengthUm).HasColumnName("gate_length_um");
        entity.Property(t => t.GateInnerRadiusUm).HasColumnName("gate_inner_radius_um");
        entity.Property(t => t.GateOuterRadiusUm).HasColumnName("gate_outer_radius_um");
        entity.Property(t => t.CoverageSectorDegree).HasColumnName("coverage_sector_degree");
        entity.Property(t => t.GeometryProperties)
            .HasColumnName("geometry_properties")
            .HasColumnType("jsonb");
        entity.Property(t => t.MobilityCm2Vs).HasColumnName("mobility_cm2_vs");
        entity.Property(t => t.OnOffRatio).HasColumnName("on_off_ratio");
        entity.Property(t => t.ThresholdVoltageV).HasColumnName("threshold_voltage_v");
        entity.Property(t => t.SubthresholdSwingMvDec).HasColumnName("subthreshold_swing_mv_dec");
        entity.Property(t => t.SgGapUm).HasColumnName("sg_gap_um");
        entity.Property(t => t.DgGapUm).HasColumnName("dg_gap_um");
        entity.HasOne(t => t.Device)
            .WithOne()
            .HasForeignKey<Transistor>(t => t.TransistorId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}