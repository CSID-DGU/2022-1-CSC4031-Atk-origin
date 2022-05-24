package site.atkproject.sttservice.util.stt.impl;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;
import site.atkproject.sttservice.util.FastApi;
import site.atkproject.sttservice.util.keyword.impl.KeywordClient;
import site.atkproject.sttservice.util.stt.SttManager;

import java.util.Objects;

@RequiredArgsConstructor
@Primary
@Component
public class SttClient implements SttManager {

    private final FastApi fastApi;

    @Override
    public String getSTT(String fileName) {
        String[] split = fileName.split("/");
        String username = split[0];
        String filename = split[1];
        Mono<Response> responseMono = fastApi.webClient.get().
                uri(uriBuilder -> uriBuilder
                        .path("/api/stt")
                        .queryParam("username", username)
                        .queryParam("filename", filename)
                        .build())
                .retrieve()
                .bodyToMono(Response.class);

        return Objects.requireNonNull(responseMono.block()).result;
    }

    @Data
    static class Response {
        private String result;
    }
}
