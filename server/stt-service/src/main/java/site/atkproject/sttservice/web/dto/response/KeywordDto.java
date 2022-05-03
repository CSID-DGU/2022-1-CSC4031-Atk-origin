package site.atkproject.sttservice.web.dto.response;

import lombok.Data;

@Data
public class KeywordDto {

    private String word;
    private String meaning;

    public KeywordDto(String word, String meaning) {
        this.word = word;
        this.meaning = meaning;
    }
}
