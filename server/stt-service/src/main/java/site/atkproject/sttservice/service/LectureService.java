package site.atkproject.sttservice.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import site.atkproject.sttservice.domain.lecture.Lecture;
import site.atkproject.sttservice.domain.lecture.LectureRepository;
import site.atkproject.sttservice.domain.quiz.Quiz;
import site.atkproject.sttservice.domain.quiz.QuizRepository;
import site.atkproject.sttservice.service.keyword.Keyword;
import site.atkproject.sttservice.service.translate.Translation;
import site.atkproject.sttservice.web.dto.response.KeywordDto;
import site.atkproject.sttservice.web.dto.response.KeywordResponseDto;
import site.atkproject.sttservice.web.dto.response.TranslationResponseDto;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Transactional(readOnly = true)
@Service
public class LectureService {

    private final LectureRepository lectureRepository;
    private final QuizRepository quizRepository;
    private final Translation translation;
    private final Keyword keyword;

    @Transactional
    public TranslationResponseDto getTranslation(Long lectureId) {
        Optional<Lecture> optional = lectureRepository.findById(lectureId);
        if (optional.isEmpty()) {
            throw new IllegalArgumentException("요청한 강의가 없습니다.");
        }
        Lecture lecture = optional.get();
        String translatedText = lecture.getTranslation();
        if (lecture.getTranslation() != null) {
            return new TranslationResponseDto(lectureId, translatedText);
        }
        translatedText = translation.translate(lecture.getContent());
        lecture.updateTranslation(translatedText);
        return new TranslationResponseDto(lectureId, translatedText);
    }

    @Transactional
    public KeywordResponseDto makeKeyword(Long lectureId) {
        Optional<Lecture> optional = lectureRepository.findById(lectureId);
        if (optional.isEmpty()) {
            return null;
        }
        Lecture lecture = optional.get();
        KeywordResponseDto keywordResponseDto = new KeywordResponseDto(lectureId);
        if (lecture.getHasKeyword()) {
            for (Quiz quiz : lecture.getQuizzes()) {
                keywordResponseDto.getKeywordList().add(new KeywordDto(quiz.getWord(), quiz.getMeaning()));
            }
            return keywordResponseDto;
        };
        String content = lecture.getContent();
        String[] keywords = keyword.separateWords(content);
        for (String keyword : keywords) {
            Quiz quiz = Quiz.builder().word(keyword).build();
            quiz.setLecture(lecture);
            quizRepository.save(quiz);

            keywordResponseDto.getKeywordList().add(new KeywordDto(quiz.getWord(), quiz.getMeaning()));
        }
        lecture.updateHasKey(true);
        return keywordResponseDto;
    }
}
