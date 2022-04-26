package site.atkproject.sttservice.exception;

import lombok.Getter;

@Getter
public enum ExceptionCode {

    ALREADY_EXIST_USER("ALREADY_USER", "회원이 이미 존재합니다."),
    WRONG_INPUT("WRONG_INPUT", "아이디 혹은 비밀번호가 유효하지 않습니다."),
    NOT_FOUND_USER("1000", "유저를 찾을 수 없습니다.");

    private final String code;
    private final String message;

    ExceptionCode(String code, String message) {
        this.code = code;
        this.message = message;
    }
}
