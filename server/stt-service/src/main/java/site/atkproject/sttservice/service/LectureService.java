package site.atkproject.sttservice.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import site.atkproject.sttservice.domain.lecture.Lecture;
import site.atkproject.sttservice.domain.lecture.LectureRepository;
import site.atkproject.sttservice.domain.quiz.Quiz;
import site.atkproject.sttservice.domain.quiz.QuizRepository;
import site.atkproject.sttservice.domain.user.User;
import site.atkproject.sttservice.domain.user.UserRepository;
import site.atkproject.sttservice.service.keyword.Keyword;
import site.atkproject.sttservice.service.translate.Translation;
import site.atkproject.sttservice.web.dto.response.*;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Slf4j
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Service
public class LectureService {

    private final UserRepository userRepository;
    private final LectureRepository lectureRepository;
    private final QuizRepository quizRepository;
    private final Translation translation;
    private final Keyword keyword;

    public BasicResponseDto<LectureResponseDto> getLecture(Long lectureId) {
        Optional<Lecture> optional = lectureRepository.findById(lectureId);
        if (optional.isEmpty()) {
            throw new IllegalStateException("요청한 강의가 없습니다.");
        }
        Lecture lecture = optional.get();
        return new BasicResponseDto<LectureResponseDto>(BasicResponseDto.SUCCESS, BasicResponseDto.LECTURE, new LectureResponseDto(lecture.getContent()));
    }

    public BasicResponseDto<List<LectureListResponseDto>> getLectureList(Principal principal) {
        String username = principal.getName();
        User user = userRepository.findByUsername(username);
        List<Lecture> lectures = lectureRepository.findAllByUser(user);
        List<LectureListResponseDto> lectureListResponseDtoList = new ArrayList<>();
        lectures.forEach(lecture -> {
            lectureListResponseDtoList.add(new LectureListResponseDto(lecture.getId(), lecture.getTitie(), lecture.getCreatedDate()));
        });
        return new BasicResponseDto<>(BasicResponseDto.SUCCESS, BasicResponseDto.LECTURE, lectureListResponseDtoList);
    }

    @Transactional
    public BasicResponseDto<TranslationResponseDto> getTranslation(Long lectureId) {
        TranslationResponseDto result;
        Optional<Lecture> optional = lectureRepository.findById(lectureId);
        if (optional.isEmpty()) {
            throw new IllegalArgumentException("요청한 강의가 없습니다.");
        }
        Lecture lecture = optional.get();
        String translatedText = lecture.getTranslation();
        if (lecture.getTranslation() != null) {
             result = new TranslationResponseDto(lectureId, translatedText);
            return new BasicResponseDto<>(BasicResponseDto.SUCCESS, BasicResponseDto.TRANSLATED, result);
        }
        translatedText = translation.translate(lecture.getContent());
        lecture.updateTranslation(translatedText);
        result = new TranslationResponseDto(lectureId, translatedText);
        return new BasicResponseDto<>(BasicResponseDto.SUCCESS, BasicResponseDto.TRANSLATED, result);
    }

    @Transactional
    public BasicResponseDto<KeywordResponseDto> makeKeyword(Long lectureId) {
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
            return new BasicResponseDto<>(BasicResponseDto.SUCCESS, BasicResponseDto.KEYWORD, keywordResponseDto);
        }
        String content = lecture.getContent();
        String[] keywords = keyword.separateWords(content);
        for (String keyword : keywords) {
            Quiz quiz = Quiz.builder().word(keyword).build();
            quiz.setLecture(lecture);
            quizRepository.save(quiz);

            keywordResponseDto.getKeywordList().add(new KeywordDto(quiz.getWord(), quiz.getMeaning()));
        }
        lecture.updateHasKey(true);
        return new BasicResponseDto<>(BasicResponseDto.SUCCESS, BasicResponseDto.KEYWORD, keywordResponseDto);
    }

    @Transactional
    public BasicResponseDto<Void> removeLecture(Long lectureId) {
        lectureRepository.deleteById(lectureId);
        return new BasicResponseDto<>(BasicResponseDto.DELETE, BasicResponseDto.LECTURE, null);
    }
}
