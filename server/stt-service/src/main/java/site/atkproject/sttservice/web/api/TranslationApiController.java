package site.atkproject.sttservice.web.api;

import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import site.atkproject.sttservice.domain.lecture.Lecture;
import site.atkproject.sttservice.domain.lecture.LectureRepository;
import site.atkproject.sttservice.service.translate.Translation;
import site.atkproject.sttservice.web.dto.TranslationRequestDto;

import java.util.Optional;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/translation")
public class TranslationApiController {

    private final LectureRepository lectureRepository;
    private final Translation translationService;

    @GetMapping("")
    public String all() {
        return "summarize";
    }

    @PostMapping("")
    public String doTranlsate(@RequestBody TranslationRequestDto translationRequestDto) throws JsonProcessingException {

        Optional<Lecture> optional = lectureRepository.findById(translationRequestDto.getId());
        Lecture lecture = optional.get();
        return translationService.translate(lecture.getContent());
    }
}
