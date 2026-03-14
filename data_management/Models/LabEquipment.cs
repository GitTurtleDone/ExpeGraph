namespace DataManagement.Models;

public class LabEquipment
{
    public int LabId { get; set; }
    public int EquipmentId { get; set; }
    public Lab Lab { get; set; } = null!;
    public Equipment Equipment { get; set; } = null!;
}