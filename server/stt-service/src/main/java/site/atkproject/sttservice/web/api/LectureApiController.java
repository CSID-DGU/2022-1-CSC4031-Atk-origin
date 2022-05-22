package site.atkproject.sttservice.web.api;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import site.atkproject.sttservice.service.LectureService;
import site.atkproject.sttservice.web.dto.response.*;

import java.security.Principal;
import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/lecture")
public class LectureApiController {

    private final LectureService lectureService;

    @GetMapping
    public BasicResponseDto<List<LectureListResponseDto>> getLectureList(Principal principal) {
        return lectureService.getLectureList(principal);
    }

    @GetMapping("/{lectureId}")
    public BasicResponseDto<LectureResponseDto> getLecture(@PathVariable Long lectureId) {
        return lectureService.getLecture(lectureId);
    }

    @DeleteMapping("/{lectureId}")
    public BasicResponseDto<Void> deleteLecture(@PathVariable Long lectureId) {
        return lectureService.removeLecture(lectureId);
    }

    @GetMapping("/{lectureId}/translate")
    public BasicResponseDto<TranslationResponseDto> getTranslateByLecture(@PathVariable Long lectureId) {
        return lectureService.getTranslation(lectureId);
    }

    @GetMapping("/{lectureId}/keyword")
    public BasicResponseDto<KeywordResponseDto> makeKeyword(@PathVariable Long lectureId) {
        return lectureService.makeKeyword(lectureId);
    }
}
