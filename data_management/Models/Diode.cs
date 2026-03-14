namespace DataManagement.Models;

public class Diode
{
    public int DiodeId { get; set; }
    public string DiodeName { get; set; } = string.Empty;
    public string GeometryType { get; set; } = string.Empty;
    // Rectangular
    public float? AnodeWidthUm { get; set; }
    public float? AnodeLengthUm { get; set; }
    public float? ChamferRadiusUm { get; set; }
    // Circular
    public float? AnodeRadiusUm { get; set; }
    // Other
    public Dictionary<string, object>? GeometryProperties { get; set; }
    // Electrical
    public float? BarrierHeightEv { get; set; }
    public float? IdealityFactor { get; set; }
    public float? RecRatio { get; set; }
    public float? BuiltInPotentialV { get; set; }
    public double? CarrierConcentration { get; set; }
    public float? MaxCurrentA { get; set; }
    public float? VoltageAtMaxCurrentV { get; set; }
    public float? BreakdownVoltageV { get; set; }
    public Device Device { get; set; } = null!;
}