enum InvokeErrorCode {
    None = 0,
    DeserializeRequestFail = 1,
    ServiceNotExists = 2,
    ServiceInnerError = 3,
    SessionNotExists = 4,
    SerializeResponseFail = 5,
    Timeout = 6,

    SendRequestFail = 10,
    DeserializeResponseFail = 11,
}

export default InvokeErrorCode;