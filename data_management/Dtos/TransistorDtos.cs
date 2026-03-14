namespace DataManagement.Dtos;

public record TransistorResponse(
    int TransistorId,
    string TransistorName,
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
    float? DgGapUm);

public record CreateTransistorRequest(
    int TransistorId,
    string TransistorName,
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
    float? DgGapUm = null);

public record UpdateTransistorRequest(
    string TransistorName,
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
    float? DgGapUm);