package site.atkproject.sttservice.web.dto.response;

import lombok.Data;
import lombok.ToString;

import java.util.List;

@Data
@ToString
public class PythonKeywordResponseDto {
    private String meaning;
    private String definition;
    private String synonyms;
    private String antonym;
    private String example;
}
