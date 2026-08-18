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

// filtering a query from the frontend
public record BatchQuery 
{
    public string? Search { get; init;}
    public int? MinId { get; init; }
    public int? MaxId { get; init; }
    public DateOnly? FabricatedFrom { get; init; }
    public DateOnly? FabricatedTo { get; init; }
    public int? ProjectId { get; init; }
    public int? LabId { get; init; }
    public string? Sort { get; init; }
    public string? Order { get; init; }
    // leave server pagination for now
    // public int Page { get; init; } = 1;
    // public int PageSize { get; init; } = 2000;
}

// public record PageResult<T> (IReadOnlyList<T> Items, int Total, int Page, int PageSize); 