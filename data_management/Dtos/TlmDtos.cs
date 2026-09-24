namespace DataManagement.Dtos;

public record TlmResponse
(
    int TlmId,
    string GeometryType,
    float? SheetResistanceOhmSq,
    float? ContactResistanceOhm,
    float? TransferLengthCm
);

public record CreateTlmRequest
(
    string GeometryType,
    float? SheetResistanceOhmSq,
    float? ContactResistanceOhm,
    float? TransferLengthCm
);

public record UpdateTlmRequest
(
    string GeometryType,
    float? SheetResistanceOhmSq,
    float? ContactResistanceOhm,
    float? TransferLengthCm
);

public record TlmQuery
{	
    public int? MinId { get; init;}
    public int? MaxId { get; init;}
    public string? GeometryType { get; init;}
    public float? MinSheetResistanceOhmSq { get; init;}
    public float? MaxSheetResistanceOhmSq { get; init;}
    public float? MinContactResistanceOhm { get; init;}
    public float? MaxContactResistanceOhm { get; init;}
    public float? MinTransferLengthCm { get; init;}
    public float? MaxTransferLengthCm { get; init;}
};