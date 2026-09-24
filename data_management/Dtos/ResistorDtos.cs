namespace DataManagement.Dtos;

public record ResistorResponse
(
    int ResistorId,
    string GeometryType,
    float? WidthUm,
    float? GapUm,
    float? InnerRadiusUm,
    float? OuterRadiusUm,
    Dictionary<string, object>? GeometryProperties,
    float? ResistanceOhm,
    int? TlmId
);

public record CreateResistorRequest
(
    int ResistorId,
    string GeometryType,
    float? WidthUm = null,
    float? GapUm = null,
    float? InnerRadiusUm = null,
    float? OuterRadiusUm = null,
    Dictionary<string, object>? GeometryProperties = null,
    float? ResistanceOhm = null,
    int? TlmId = null);

public record UpdateResistorRequest
(
    string GeometryType,
    float? WidthUm,
    float? GapUm,
    float? InnerRadiusUm,
    float? OuterRadiusUm,
    Dictionary<string, object>? GeometryProperties,
    float? ResistanceOhm,
    int? TlmId
);

public record ResistorQuery
{	
    public int? MinId { get; init;}
    public int? MaxId { get; init;}
    public string? GeometryType { get; init;}
    public float? MinWidthUm { get; init;}
    public float? MaxWidthUm { get; init;}
    public float? MinGapUm { get; init;}
    public float? MaxGapUm { get; init;}
    public float? MinInnerRadiusUm { get; init;}
    public float? MaxInnerRadiusUm { get; init;}
    public float? MinOuterRadiusUm { get; init;}
    public float? MaxOuterRadiusUm { get; init;}
    public float? MinResistanceOhm { get; init;}
    public float? MaxResistanceOhm { get; init;}
    public int? TlmId { get; init;}
};