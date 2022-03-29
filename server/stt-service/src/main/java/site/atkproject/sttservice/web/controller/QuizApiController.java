package site.atkproject.sttservice.web.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import site.atkproject.sttservice.domain.quiz.Quiz;
import site.atkproject.sttservice.service.QuizService;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/quiz")
public class QuizApiController {

    private final QuizService quizService;

    @GetMapping
    public List<Quiz> all() {
        return quizService.getQuizList();
    }
}
