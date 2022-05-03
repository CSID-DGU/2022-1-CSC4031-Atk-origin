package site.atkproject.sttservice.web.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
public class KeywordResponseDto {

    private Long lectureId;
    private List<KeywordDto> keywordList;

    public KeywordResponseDto(Long lectureId) {
        this.lectureId = lectureId;
        this.keywordList = new ArrayList<>();
    }
}
