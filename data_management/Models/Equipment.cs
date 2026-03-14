namespace DataManagement.Models;

public class Equipment
{
    public int EquipmentId { get; set; }
    public string EquipmentName { get; set; } = string.Empty;
    public string? Manufacturer { get; set; }
    public string? Model { get; set; }
    public string? SerialNumber { get; set; }
    public short? PurchaseYear { get; set; }
    public DateOnly? CalibrationDue { get; set; }
    public string? Location { get; set; }
    public string? ConnectingStr { get; set; }
    public string? Notes { get; set; }
    public ICollection<LabEquipment>? LabEquipments { get; set; }
    public ICollection<Measurement>? Measurements { get; set; }
}
