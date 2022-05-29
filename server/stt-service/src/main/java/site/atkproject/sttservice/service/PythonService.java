package site.atkproject.sttservice.service;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import site.atkproject.sttservice.domain.quiz.Quiz;
import site.atkproject.sttservice.util.FastApi;
import site.atkproject.sttservice.util.stt.impl.SttClient;
import site.atkproject.sttservice.web.dto.response.PythonKeywordListResponseDto;
import site.atkproject.sttservice.web.dto.response.PythonKeywordResponseDto;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Service
public class PythonService {

    private final FastApi fastApi;

    public PythonKeywordResponseDto getKeywordInfo(String keyword) {
        return fastApi.webClient.get().
                uri(uriBuilder -> uriBuilder
                        .path("/api/keyword-info")
                        .queryParam("keyword", keyword)
                        .build())
                .retrieve()
                .bodyToMono(PythonKeywordResponseDto.class)
                .block();
    }

//    @Async
    public PythonKeywordListResponseDto setKeywordInfo(List<Quiz> quizList) {
        List<List<String>> quiz = new ArrayList<>();
        quizList.forEach(quiz1 -> {
            List<String> list = new ArrayList<>();
            list.add(String.valueOf(quiz1.getId()));
            list.add(quiz1.getWord());
            quiz.add(list);
        });

        KeywordListRequestDto keywordListRequestDto = new KeywordListRequestDto(quiz);
        System.out.println(keywordListRequestDto);
        return fastApi.webClient.post().uri("/api/keyword-info").body(Mono.just(keywordListRequestDto), KeywordListRequestDto.class)
                .retrieve().bodyToMono(PythonKeywordListResponseDto.class).block();
    }

    @Data
    @AllArgsConstructor
    static class KeywordListRequestDto {

        private List<List<String>> keywords;
    }
}
