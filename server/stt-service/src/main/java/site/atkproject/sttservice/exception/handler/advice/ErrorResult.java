package site.atkproject.sttservice.exception.handler.advice;

import lombok.AllArgsConstructor;
import lombok.Data;
import site.atkproject.sttservice.exception.ExceptionCode;

@Data
public class ErrorResult {
    private String code;
    private String message;

    public ErrorResult(ExceptionCode exception) {
        code = exception.getCode();
        message = exception.getMessage();
    }
}
