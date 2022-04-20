package site.atkproject.sttservice.domain.quiz;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import site.atkproject.sttservice.domain.lecture.Lecture;

import javax.persistence.*;

@Getter
@NoArgsConstructor
@ToString
@Entity
public class Quiz {

    @Id
    @GeneratedValue
    @Column(name = "quiz_id")
    private Long id;

    private String word;
    private String meaning;

    @ManyToOne(fetch = FetchType.LAZY)
    private Lecture lecture;

    @Builder
    public Quiz(String word, String meaning) {
        this.word = word;
        this.meaning = meaning;
    }
}
