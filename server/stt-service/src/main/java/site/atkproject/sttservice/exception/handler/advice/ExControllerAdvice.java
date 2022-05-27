package site.atkproject.sttservice.exception.handler.advice;

import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import site.atkproject.sttservice.exception.ExceptionCode;
import site.atkproject.sttservice.exception.UserException;
import site.atkproject.sttservice.exception.WrongInputException;
import site.atkproject.sttservice.web.dto.user.JoinUserDto;

@Slf4j
@RestControllerAdvice
public class ExControllerAdvice {

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(UserException.class)
    public ErrorResult joinUserExHandler(UserException e) {
        return new ErrorResult(ExceptionCode.ALREADY_EXIST_USER);
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(WrongInputException.class)
    public ErrorResult wrongInputExHandler(WrongInputException e) {
        return new ErrorResult(ExceptionCode.WRONG_INPUT);
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(EmptyResultDataAccessException.class)
    public ErrorResult emptyResultDataAccessException(EmptyResultDataAccessException e) {
        return new ErrorResult(ExceptionCode.NOT_FOUND_LECTURE);
    }
}
