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

// for filtering a query from the frontend
// when searching for samples

public record SampleQuery
{
    public string? Search { get; init; }
    public int? MinId { get; init; }
    public int? MaxId { get; init; }
    public int? BatchId { get; init; }
    public string? Sort { get; init; }
    public string? Order { get; init; }

}