package site.atkproject.sttservice.web.dto.request;

import lombok.Data;
import site.atkproject.sttservice.domain.lecture.Lecture;

@Data
public class SttStartRequestDto {
    private String title;

    public Lecture toEntity() {
        return Lecture.builder().title(title).build();
    }
}
