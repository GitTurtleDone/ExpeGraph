namespace DataManagement.Dtos;

public record EquipmentResponse(
    int EquipmentId,
    string EquipmentName,
    string? Manufacturer,
    string? Model,
    string? SerialNumber,
    short? PurchaseYear,
    DateOnly? CalibrationDue,
    string? Location,
    string? ConnectingStr,
    string? Notes);

public record CreateEquipmentRequest(
    string EquipmentName,
    string? Manufacturer,
    string? Model,
    string? SerialNumber,
    short? PurchaseYear,
    DateOnly? CalibrationDue,
    string? Location,
    string? ConnectingStr,
    string? Notes);

public record UpdateEquipmentRequest(
    string EquipmentName,
    string? Manufacturer,
    string? Model,
    string? SerialNumber,
    short? PurchaseYear,
    DateOnly? CalibrationDue,
    string? Location,
    string? ConnectingStr,
    string? Notes);