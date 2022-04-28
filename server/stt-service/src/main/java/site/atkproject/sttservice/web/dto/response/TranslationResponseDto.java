package site.atkproject.sttservice.web.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TranslationResponseDto {

    private Long lectureId;
    private String translatedText;
}
