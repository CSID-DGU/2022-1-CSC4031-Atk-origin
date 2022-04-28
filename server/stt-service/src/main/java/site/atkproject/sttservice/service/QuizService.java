package site.atkproject.sttservice.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import site.atkproject.sttservice.domain.lecture.Lecture;
import site.atkproject.sttservice.domain.lecture.LectureRepository;
import site.atkproject.sttservice.domain.quiz.Quiz;
import site.atkproject.sttservice.domain.quiz.QuizRepository;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Service
public class QuizService {

    private final LectureRepository lectureRepository;
    private final QuizRepository quizRepository;

    public Quiz getQuiz(Long id) {
        return quizRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("찾을 수 없음"));
    }

    public List<Quiz> getQuizList(Long lectureId) {
        Lecture lecture = lectureRepository.findById(lectureId).get();
        List<Quiz> quizList = lecture.getQuizzes();
        log.info("quiz service: {}", quizList);
        return quizList;
    }

    public Quiz saveQuiz(Quiz quiz) {
        return quizRepository.save(quiz);
    }
}
