namespace DataManagement.Dtos;

public record BatchResponse(
    int BatchId,
    string BatchName,
    string? Description,
    DateOnly FabricationDate,
    string? Treatment,
    int? ProjectId,
    int? LabId,
    DateTime CreatedAt);

public record CreateBatchRequest(
    string BatchName,
    DateOnly FabricationDate,
    string? Description,
    string? Treatment,
    int? ProjectId,
    int? LabId);

public record UpdateBatchRequest(
    string BatchName,
    DateOnly FabricationDate,
    string? Description,
    string? Treatment,
    int? ProjectId,
    int? LabId);
