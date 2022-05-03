package site.atkproject.sttservice.web.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
public class SttStartResponseDto {
    private long id;
    private String title;

    @Builder
    public SttStartResponseDto(long id, String title) {
        this.id = id;
        this.title = title;
    }
}
