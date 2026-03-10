namespace DataManagement.Models;
public class Sample
{
    public int SampleId { get; set; }
    public string SampleName { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Treatment{ get; set; }
    public Dictionary<string, object>? Properties { get; set; }
    public int? BatchId { get; set; }
    public Batch? Batch { get; set; }
    public DateTime CreatedAt { get; set; } 
    public ICollection<Device> Devices { get; set;} = [];
       
}