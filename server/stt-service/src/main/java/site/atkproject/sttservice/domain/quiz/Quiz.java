package site.atkproject.sttservice.domain.quiz;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import site.atkproject.sttservice.domain.BaseTimeEntity;
import site.atkproject.sttservice.domain.lecture.Lecture;

import javax.persistence.*;

@Getter
@NoArgsConstructor
@ToString
@Entity
public class Quiz extends BaseTimeEntity {

    @Id
    @GeneratedValue
    @Column(name = "quiz_id")
    private Long id;

    private String word;
    private String meaning;
    private String definition;
    private String synonym;
    private String antonym;
    @Lob
    private String example;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @ToString.Exclude
    private Lecture lecture;

    @Builder
    public Quiz(String word, String meaning, String definition, String synonym, String antonym, String example) {
        this.word = word;
        this.meaning = meaning;
        this.definition = definition;
        this.synonym = synonym;
        this.antonym = antonym;
        this.example = example;
    }

    public void setLecture(Lecture lecture) {
        this.lecture = lecture;
        lecture.getQuizzes().add(this);
    }
}
