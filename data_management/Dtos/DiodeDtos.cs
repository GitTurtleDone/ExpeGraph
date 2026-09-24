namespace DataManagement.Dtos;

public record DiodeResponse(
    int DiodeId,
    string GeometryType,
    float? AnodeWidthUm,
    float? AnodeLengthUm,
    float? ChamferRadiusUm,
    float? AnodeRadiusUm,
    Dictionary<string, object>? GeometryProperties,
    float? BarrierHeightEv,
    float? IdealityFactor,
    float? RecRatio,
    float? BuiltInPotentialV,
    double? CarrierConcentration,
    float? MaxCurrentA,
    float? VoltageAtMaxCurrentV,
    float? BreakdownVoltageV);

public record CreateDiodeRequest(
    int DiodeId,
    string GeometryType,
    float? AnodeWidthUm = null,
    float? AnodeLengthUm = null,
    float? ChamferRadiusUm = null,
    float? AnodeRadiusUm = null,
    Dictionary<string, object>? GeometryProperties = null,
    float? BarrierHeightEv = null,
    float? IdealityFactor = null,
    float? RecRatio = null,
    float? BuiltInPotentialV = null,
    double? CarrierConcentration = null,
    float? MaxCurrentA = null,
    float? VoltageAtMaxCurrentV = null,
    float? BreakdownVoltageV = null);

public record UpdateDiodeRequest(
    string GeometryType,
    float? AnodeWidthUm,
    float? AnodeLengthUm,
    float? ChamferRadiusUm,
    float? AnodeRadiusUm,
    Dictionary<string, object>? GeometryProperties,
    float? BarrierHeightEv,
    float? IdealityFactor,
    float? RecRatio,
    float? BuiltInPotentialV,
    double? CarrierConcentration,
    float? MaxCurrentA,
    float? VoltageAtMaxCurrentV,
    float? BreakdownVoltageV);

public record DiodeQuery
{
    public string? SearchTxt { get; init;}
    public int? MinId { get; set;}
    public int? MaxId { get; set;}
    public string? GeometryType { get; set;}
    public float? AnodeWidthUmFrom { get; set;}
    public float? AnodeWidthUmTo { get; set;}
    float? AnodeLengthUmFrom { get; set;}
    public float? AnodeLengthUmTo { get; set;}
    float? AnodeRadiusUmFrom { get; set;}
    float? AnodeRadiusUmTo { get; set;}
    float? ChamferRadiusUmFrom { get; set;}
    float? ChamferRadiusUmTo { get; set;}
    
    float? BarrierHeightEvFrom { get; set;}
    float? BarrierHeightEvTo { get; set;}
    float? IdealityFactorFrom { get; set;}
    float? IdealityFactorTo { get; set;}
    float? RecRatioFrom { get; set;}
    float? RecRatioTo { get; set;}
    float? BuiltInPotentialVFrom { get; set;}
    float? BuiltInPotentialVTo { get; set;}
    double? CarrierConcentrationFrom { get; set;}
    double? CarrierConcentrationTo { get; set;}
    float? MaxCurrentAFrom { get; set;}
    float? MaxCurrentATo { get; set;}
    float? VoltageAtMaxCurrentVFrom { get; set;}
    float? VoltageAtMaxCurrentVTo { get; set;}
    float? BreakdownVoltageVFrom { get; set;}
    float? BreakdownVoltageVTo { get; set;}
};