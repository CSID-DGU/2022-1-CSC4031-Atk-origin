package site.atkproject.sttservice.web.api;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import site.atkproject.sttservice.service.LectureService;
import site.atkproject.sttservice.web.dto.response.KeywordResponseDto;
import site.atkproject.sttservice.web.dto.response.TranslationResponseDto;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/lecture")
public class LectureApiController {

    private final LectureService lectureService;

    @GetMapping("/{lectureId}/translate")
    public TranslationResponseDto getTranslateByLecture(@PathVariable Long lectureId) {
        return lectureService.getTranslation(lectureId);
    }

    @GetMapping("/{lectureId}/keyword")
    public KeywordResponseDto makeKeyword(@PathVariable Long lectureId) {
        return lectureService.makeKeyword(lectureId);
    }
}
