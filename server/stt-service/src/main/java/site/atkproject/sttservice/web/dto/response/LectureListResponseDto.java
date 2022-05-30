package site.atkproject.sttservice.web.dto.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class LectureListResponseDto {

    private Long id;
    private String title;
    private LocalDateTime studyDate;
    private Integer score;

    public LectureListResponseDto(Long id, String title, LocalDateTime studyDate, Integer score) {
        this.id = id;
        this.title = title;
        this.studyDate = studyDate;
        this.score = score;
    }
}
