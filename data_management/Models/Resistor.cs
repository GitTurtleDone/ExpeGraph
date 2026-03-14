namespace DataManagement.Models;

public class Resistor
{
    public int ResistorId { get; set; }
    public string ResistorName { get; set; } = string.Empty;
    public string GeometryType { get; set; } = string.Empty;
    // Rectangular
    public float? WidthUm { get; set; }
    public float? GapUm { get; set; }
    // Circular
    public float? InnerRadiusUm { get; set; }
    public float? OuterRadiusUm { get; set; }
    // Other
    public Dictionary<string, object>? GeometryProperties { get; set; }
    // Electrical
    public float? ResistanceOhm { get; set; }
    public int? TlmId { get; set; }
    public Tlm? Tlm { get; set; }
    public Device Device { get; set; } = null!;
}