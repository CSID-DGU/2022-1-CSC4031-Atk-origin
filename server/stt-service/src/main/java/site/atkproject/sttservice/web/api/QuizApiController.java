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

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/quiz")
public class QuizApiController {

    private final QuizService quizService;

    @GetMapping("/{lectureId}")
    public List<Quiz> lectureKeyword(@PathVariable Long lectureId) {
        log.info("QUIZController {}", lectureId);
        return quizService.getQuizList(lectureId);
    }
}
