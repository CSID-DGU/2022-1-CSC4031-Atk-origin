package site.atkproject.sttservice.domain.quiz;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@NoArgsConstructor
@ToString
@Document("quiz")
public class Quiz {

    @Id
    private String id;

    private String word;
    private String meaning;

    @Builder
    public Quiz(String word, String meaning) {
        this.word = word;
        this.meaning = meaning;
    }
}
