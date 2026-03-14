namespace DataManagement.Dtos;

public record ResistorResponse(
    int ResistorId,
    string ResistorName,
    string GeometryType,
    float? WidthUm,
    float? GapUm,
    float? InnerRadiusUm,
    float? OuterRadiusUm,
    Dictionary<string, object>? GeometryProperties,
    float? ResistanceOhm,
    int? TlmId);

public record CreateResistorRequest(
    int ResistorId,
    string ResistorName,
    string GeometryType,
    float? WidthUm = null,
    float? GapUm = null,
    float? InnerRadiusUm = null,
    float? OuterRadiusUm = null,
    Dictionary<string, object>? GeometryProperties = null,
    float? ResistanceOhm = null,
    int? TlmId = null);

public record UpdateResistorRequest(
    string ResistorName,
    string GeometryType,
    float? WidthUm,
    float? GapUm,
    float? InnerRadiusUm,
    float? OuterRadiusUm,
    Dictionary<string, object>? GeometryProperties,
    float? ResistanceOhm,
    int? TlmId);