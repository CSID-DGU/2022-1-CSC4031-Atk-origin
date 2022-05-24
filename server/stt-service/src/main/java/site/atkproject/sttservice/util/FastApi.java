package site.atkproject.sttservice.util;

import lombok.Data;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Objects;

@Component
public class FastApi {

    private static final String url = "http://localhost:8000";

    public WebClient webClient = WebClient.create(url);

    public String getStt() {
        long start = System.currentTimeMillis();
        String block = webClient.get().uri("/items/testaudio").retrieve().bodyToMono(String.class).block();
        System.out.println((System.currentTimeMillis()-start)/1000);
        return block;
    }

    public String getKeyword() {
        Keyword keyword = new Keyword();
        keyword.content = "hello bye hi may i help you";
        Mono<Result> resultMono = webClient.post().uri("/api/keyword").body(Mono.just(keyword), Keyword.class).retrieve()
                .bodyToMono(Result.class);
        return Objects.requireNonNull(resultMono.block()).result;
    }

    public static void main(String[] args) {
        FastApi fastApi = new FastApi();
        String keyword = fastApi.getKeyword();
        System.out.println(keyword);
    }

    @Data
    static class Keyword {
        private String content;
    }

    @Data
    static class Result {
        private String result;
    }
}
