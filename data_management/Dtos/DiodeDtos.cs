namespace DataManagement.Dtos;

public record DiodeResponse(
    int DiodeId,
    string DiodeName,
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
    string DiodeName,
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
    string DiodeName,
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