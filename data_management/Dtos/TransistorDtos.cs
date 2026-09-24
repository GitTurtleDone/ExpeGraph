namespace DataManagement.Dtos;

public record TransistorResponse
(
    int TransistorId,
    string GeometryType,
    float? GateWidthUm,
    float? GateLengthUm,
    float? GateInnerRadiusUm,
    float? GateOuterRadiusUm,
    float? CoverageSectorDegree,
    Dictionary<string, object>? GeometryProperties,
    float? MobilityCm2Vs,
    float? OnOffRatio,
    float? ThresholdVoltageV,
    float? SubthresholdSwingMvDec,
    float? SgGapUm,
    float? DgGapUm
);

public record CreateTransistorRequest
(
    int TransistorId,
    string GeometryType,
    float? GateWidthUm = null,
    float? GateLengthUm = null,
    float? GateInnerRadiusUm = null,
    float? GateOuterRadiusUm = null,
    float? CoverageSectorDegree = null,
    Dictionary<string, object>? GeometryProperties = null,
    float? MobilityCm2Vs = null,
    float? OnOffRatio = null,
    float? ThresholdVoltageV = null,
    float? SubthresholdSwingMvDec = null,
    float? SgGapUm = null,
    float? DgGapUm = null
);

public record UpdateTransistorRequest
(
    string GeometryType,
    float? GateWidthUm,
    float? GateLengthUm,
    float? GateInnerRadiusUm,
    float? GateOuterRadiusUm,
    float? CoverageSectorDegree,
    Dictionary<string, object>? GeometryProperties,
    float? MobilityCm2Vs,
    float? OnOffRatio,
    float? ThresholdVoltageV,
    float? SubthresholdSwingMvDec,
    float? SgGapUm,
    float? DgGapUm
);

public record TransistorQuery
{	
    public int? MinId { get; init;}
    public int? MaxId { get; init;}
    public string? GeometryType { get; init;}
    public float? MinGateWidthUm { get; init;}
    public float? MaxGateWidthUm { get; init;}
    public float? MinGateLengthUm { get; init;}
    public float? MaxGateLengthUm { get; init;}
    public float? MinGateInnerRadiusUm { get; init;}
    public float? MaxGateInnerRadiusUm { get; init;}
    public float? MinGateOuterRadiusUm { get; init;}
    public float? MaxGateOuterRadiusUm { get; init;}
    public float? MinCoverageSectorDegree { get; init;}
    public float? MaxCoverageSectorDegree { get; init;}
    public float? MinMobilityCm2Vs { get; init;}
    public float? MaxMobilityCm2Vs { get; init;}
    public float? MinOnOffRatio { get; init;}
    public float? MaxOnOffRatio { get; init;}
    public float? MinThresholdVoltageV { get; init;}
    public float? MaxThresholdVoltageV { get; init;}
    public float? MinSubthresholdSwingMvDec { get; init;}
    public float? MaxSubthresholdSwingMvDec { get; init;}
    public float? MinSgGapUm { get; init;}
    public float? MaxSgGapUm { get; init;}
    public float? MinDgGapUm { get; init;}
    public float? MaxDgGapUm { get; init;}
};