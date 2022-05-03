package site.atkproject.sttservice.web.dto.response;

import lombok.Data;

@Data
public class SttResultResponseDto {

    private Long lectureId;
    private String text;

    public SttResultResponseDto(Long lectureId, String text) {
        this.lectureId = lectureId;
        this.text = text;
    }
}
