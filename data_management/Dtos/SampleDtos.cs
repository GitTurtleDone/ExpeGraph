namespace DataManagement.Dtos;

public record SampleResponse(
    int SampleId,
    string SampleName,
    string? Description,
    string? Treatment,
    Dictionary<string, object>? Properties,
    int? BatchId,
    DateTime CreatedAt);

public record CreateSampleRequest(
    string SampleName,
    string? Description,
    string? Treatment,
    Dictionary<string, object>? Properties,
    int? BatchId);

public record UpdateSampleRequest(
    string SampleName,
    string? Description,
    string? Treatment,
    Dictionary<string, object>? Properties,
    int? BatchId);