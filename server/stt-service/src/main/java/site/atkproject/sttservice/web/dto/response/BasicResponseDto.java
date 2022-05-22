package site.atkproject.sttservice.web.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class BasicResponseDto<T> {

    public static final String SUCCESS = "SUCCESS";
    public static final String DELETE = "DELETE";
    public static final String FAIL = "FAIL";

    public static final String TRANSLATED = "TRANSLATED";
    public static final String KEYWORD = "KEYWORD";
    public static final String LECTURE = "LECTURE";
    public static final String STT = "STT";
    public static final String QUIZ = "QUIZ";

    private String code;
    private String type;
    private T extraResult;
}
