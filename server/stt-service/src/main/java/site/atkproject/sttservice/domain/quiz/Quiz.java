package site.atkproject.sttservice.domain.quiz;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Getter
@NoArgsConstructor
@ToString
@Entity
public class Quiz {

    @Id
    @GeneratedValue
    private Long id;

    private String word;
    private String meaning;

    @Builder
    public Quiz(String word, String meaning) {
        this.word = word;
        this.meaning = meaning;
    }
}
