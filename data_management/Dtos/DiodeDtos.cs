namespace DataManagement.Dtos;

public record DiodeResponse
(
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
    float? BreakdownVoltageV
);

public record CreateDiodeRequest
(
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
    float? BreakdownVoltageV = null
);

public record UpdateDiodeRequest
(
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
    float? BreakdownVoltageV
);

public record DiodeQuery
{
    public string? SearchTxt { get; init;}
    public int? MinId { get; init;}
    public int? MaxId { get; init;}
    public string? GeometryType { get; init;}
    public float? MinAnodeWidthUm { get; init;}
    public float? MaxAnodeWidthUm { get; init;}
    float? MinAnodeLengthUm { get; init;}
    public float? MaxAnodeLengthUm { get; init;}
    float? MinAnodeRadiusUm { get; init;}
    float? MaxAnodeRadiusUm { get; init;}
    float? MinChamferRadiusUm { get; init;}
    float? MaxChamferRadiusUm { get; init;}
    float? MinBarrierHeightEv { get; init;}
    float? MaxBarrierHeightEv { get; init;}
    float? MinIdealityFactor { get; init;}
    float? MaxIdealityFactor { get; init;}
    float? MinRecRatio { get; init;}
    float? MaxRecRatio { get; init;}
    float? MinBuiltInPotentialV { get; init;}
    float? MaxBuiltInPotentialV { get; init;}
    double? MinCarrierConcentration { get; init;}
    double? MaxCarrierConcentration { get; init;}
    float? MinMaxCurrentA { get; init;}
    float? MaxMaxCurrentA { get; init;}
    float? MinVoltageAtMaxCurrentV { get; init;}
    float? MaxVoltageAtMaxCurrentV { get; init;}
    float? MinBreakdownVoltageV { get; init;}
    float? MaxBreakdownVoltageV { get; init;}
};