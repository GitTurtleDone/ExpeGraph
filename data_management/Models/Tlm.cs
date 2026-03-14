namespace DataManagement.Models;

public class Tlm
{
    public int TlmId { get; set; }
    public string GeometryType { get; set; } = string.Empty;
    public float? SheetResistanceOhmSq { get; set; }
    public float? ContactResistanceOhm { get; set; }
    public float? TransferLengthCm { get; set; }
    public ICollection<Resistor>? Resistors { get; set; }
}