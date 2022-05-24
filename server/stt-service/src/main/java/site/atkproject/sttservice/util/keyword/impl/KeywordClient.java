package site.atkproject.sttservice.util.keyword.impl;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;
import site.atkproject.sttservice.util.FastApi;
import site.atkproject.sttservice.util.keyword.Keyword;

import java.util.Objects;

@RequiredArgsConstructor
@Primary
@Component
public class KeywordClient implements Keyword {

    private final FastApi fastApi;

    @Override
    public String getKeyword(String content) {
        Request request = new Request();
        request.setContent(content);
        Mono<Response> responseMono = fastApi.webClient.post().uri("/api/keyword").body(Mono.just(request), Request.class)
                .retrieve().bodyToMono(Response.class);

        return Objects.requireNonNull(responseMono.block()).result;
    }

    @Data
    static class Request {
        private String content;
    }

    @Data
    static class Response {
        private String result;
    }
}
