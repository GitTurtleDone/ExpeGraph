namespace DataManagement.Dtos;

public record TlmResponse(
    int TlmId,
    string GeometryType,
    float? SheetResistanceOhmSq,
    float? ContactResistanceOhm,
    float? TransferLengthCm);

public record CreateTlmRequest(
    string GeometryType,
    float? SheetResistanceOhmSq,
    float? ContactResistanceOhm,
    float? TransferLengthCm);

public record UpdateTlmRequest(
    string GeometryType,
    float? SheetResistanceOhmSq,
    float? ContactResistanceOhm,
    float? TransferLengthCm);