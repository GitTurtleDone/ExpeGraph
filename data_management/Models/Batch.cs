namespace DataManagement.Models;

public class Batch
{
    public int BatchId { get; set; }
    public string BatchName { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateOnly FabricationDate { get; set; }
    public string? Treatment { get; set; }
    public int? ProjectId { get; set; }
    public int? LabId { get; set; }
    public DateTime CreatedAt { get; set; }
    public ICollection<Sample> Samples { get; set; } = [];
}
