package core

type HttpError struct {
    Code int
    Message string
    LogMessage string
}

func (err HttpError) Error() string {
    return err.Message
}

func NewHttpError(code int, message string) HttpError {
    return HttpError{
        Code: code,
        Message: message,
        LogMessage: message,
    }
}

func NewHttpErrorWithLog(code int, message string, logMessage string) HttpError {
    return HttpError{
        Code: code,
        Message: message,
        LogMessage: logMessage,
    }
}

func NewHttpErrorFromError(err error) HttpError {
    herr, ok := err.(HttpError)
    if !ok {
        return NewHttpErrorWithLog(500, "Internal Server Error", err.Error())
    }
    return herr
}
