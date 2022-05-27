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
import site.atkproject.sttservice.util.keyword.impl.KeywordClient;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Service
public class AsyncService {

    private final FastApi fastApi;

    @Async
    public void setKeywordInfo(List<Quiz> quizList) {
        List<List<String>> quiz = new ArrayList<>();
        quizList.forEach(quiz1 -> {
            List<String> list = new ArrayList<>();
            list.add(String.valueOf(quiz1.getId()));
            list.add(quiz1.getWord());
            quiz.add(list);
        });

        KeywordListRequestDto keywordListRequestDto = new KeywordListRequestDto(quiz);
        System.out.println(keywordListRequestDto);
        String block = fastApi.webClient.post().uri("/api/keyword-info").body(Mono.just(keywordListRequestDto), KeywordListRequestDto.class)
                .retrieve().bodyToMono(String.class).block();
        System.out.println(block);
    }

    @Data
    @AllArgsConstructor
    static class KeywordListRequestDto {

        private List<List<String>> keywords;
    }
}
