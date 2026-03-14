namespace DataManagement.Models;

public class Transistor
{
    public int TransistorId { get; set; }
    public string TransistorName { get; set; } = string.Empty;
    public string GeometryType { get; set; } = string.Empty;
    // Rectangular
    public float? GateWidthUm { get; set; }
    public float? GateLengthUm { get; set; }
    // Circular
    public float? GateInnerRadiusUm { get; set; }
    public float? GateOuterRadiusUm { get; set; }
    public float? CoverageSectorDegree { get; set; }
    // Other
    public Dictionary<string, object>? GeometryProperties { get; set; }
    // Electrical
    public float? MobilityCm2Vs { get; set; }
    public float? OnOffRatio { get; set; }
    public float? ThresholdVoltageV { get; set; }
    public float? SubthresholdSwingMvDec { get; set; }
    public float? SgGapUm { get; set; }
    public float? DgGapUm { get; set; }
    public Device Device { get; set; } = null!;
}