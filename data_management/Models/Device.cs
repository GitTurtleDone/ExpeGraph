namespace DataManagement.Models;
public class Device
{
    public int DeviceId { get; set; }
    public string DeviceName { get; set;} = string.Empty;
    public string DeviceType { get; set;} = string.Empty;
    public int SampleId { get; set; }
    public Sample? Sample { get; set; }

}