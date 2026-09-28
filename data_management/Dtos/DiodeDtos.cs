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
    public int? MinId { get; init;}
    public int? MaxId { get; init;}
    public string? GeometryType { get; init;}
    public float? MinAnodeWidthUm { get; init;}
    public float? MaxAnodeWidthUm { get; init;}
    public float? MinAnodeLengthUm { get; init;}
    public float? MaxAnodeLengthUm { get; init;}
    public float? MinAnodeRadiusUm { get; init;}
    public float? MaxAnodeRadiusUm { get; init;}
    public float? MinChamferRadiusUm { get; init;}
    public float? MaxChamferRadiusUm { get; init;}
    public float? MinBarrierHeightEv { get; init;}
    public float? MaxBarrierHeightEv { get; init;}
    public float? MinIdealityFactor { get; init;}
    public float? MaxIdealityFactor { get; init;}
    public float? MinRecRatio { get; init;}
    public float? MaxRecRatio { get; init;}
    public float? MinBuiltInPotentialV { get; init;}
    public float? MaxBuiltInPotentialV { get; init;}
    public double? MinCarrierConcentration { get; init;}
    public double? MaxCarrierConcentration { get; init;}
    public float? MinMaxCurrentA { get; init;}
    public float? MaxMaxCurrentA { get; init;}
    public float? MinVoltageAtMaxCurrentV { get; init;}
    public float? MaxVoltageAtMaxCurrentV { get; init;}
    public float? MinBreakdownVoltageV { get; init;}
    public float? MaxBreakdownVoltageV { get; init;}
}