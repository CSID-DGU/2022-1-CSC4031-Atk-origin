package site.atkproject.sttservice.web.api;

import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import site.atkproject.sttservice.domain.quiz.Quiz;
import site.atkproject.sttservice.service.QuizService;
import site.atkproject.sttservice.util.PythonManager;
import site.atkproject.sttservice.web.dto.response.BasicResponseDto;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/quiz")
public class QuizApiController {

    private final QuizService quizService;

    @GetMapping("/{lectureId}")
    public BasicResponseDto<List<Quiz>> lectureKeyword(@PathVariable Long lectureId) {
        log.info("QUIZController {}", lectureId);
        List<Quiz> quizList = quizService.getQuizList(lectureId);
        return new BasicResponseDto<>(BasicResponseDto.SUCCESS, BasicResponseDto.QUIZ, quizList);
    }
}
