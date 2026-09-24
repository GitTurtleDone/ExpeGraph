namespace DataManagement.Dtos;

public record EquipmentResponse
(
    int EquipmentId,
    string EquipmentName,
    string? Manufacturer,
    string? Model,
    string? SerialNumber,
    short? PurchaseYear,
    DateOnly? CalibrationDue,
    string? Location,
    string? ConnectingStr,
    string? Notes
);

public record CreateEquipmentRequest
(
    string EquipmentName,
    string? Manufacturer,
    string? Model,
    string? SerialNumber,
    short? PurchaseYear,
    DateOnly? CalibrationDue,
    string? Location,
    string? ConnectingStr,
    string? Notes
);

public record UpdateEquipmentRequest
(
    string EquipmentName,
    string? Manufacturer,
    string? Model,
    string? SerialNumber,
    short? PurchaseYear,
    DateOnly? CalibrationDue,
    string? Location,
    string? ConnectingStr,
    string? Notes
);

public record EquipmentQuery
{
    public string? SearchTxt { get; init;}
    public int? MinId { get; set;}
    public int? MaxId { get; set;}
    public short? PurchaseYearFrom { get; init;}
    public short? PurchaseYearTo { get; init;}
    public DateOnly? CalibrationDueFrom { get; init;}
    public DateOnly? CalibrationDueTo { get; init;}
    public string? Location { get; init;}
    
};