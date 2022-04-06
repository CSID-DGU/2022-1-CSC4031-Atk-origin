package site.atkproject.sttservice.service;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import site.atkproject.sttservice.domain.quiz.Quiz;
import site.atkproject.sttservice.domain.quiz.QuizRepository;

import java.util.List;

@RequiredArgsConstructor
@Service
public class QuizService {

    private final QuizRepository quizRepository;

    public Quiz getQuiz(Long id) {
        return quizRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("찾을 수 없음"));
    }

    public List<Quiz> getQuizList() {
        return quizRepository.findAll();
    }

    public Quiz saveQuiz(Quiz quiz) {
        return quizRepository.save(quiz);
    }
}
