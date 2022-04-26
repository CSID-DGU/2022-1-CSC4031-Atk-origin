package site.atkproject.sttservice.web.api;

import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import site.atkproject.sttservice.domain.quiz.Quiz;
import site.atkproject.sttservice.service.QuizService;
import site.atkproject.sttservice.util.TestPython;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/quiz")
public class QuizApiController {

    private final QuizService quizService;
    private final TestPython testPython;

    @GetMapping
    public List<Quiz> all() throws JsonProcessingException {
        testPython.getResult();
        return quizService.getQuizList();
    }
}
