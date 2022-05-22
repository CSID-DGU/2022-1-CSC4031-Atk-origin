package site.atkproject.sttservice.web.dto.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class LectureListResponseDto {

    private Long id;
    private String title;
    private LocalDateTime studyDate;

    public LectureListResponseDto(Long id, String title, LocalDateTime studyDate) {
        this.id = id;
        this.title = title;
        this.studyDate = studyDate;
    }
}
