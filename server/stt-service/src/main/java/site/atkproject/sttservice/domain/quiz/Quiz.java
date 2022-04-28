package site.atkproject.sttservice.domain.quiz;

import com.fasterxml.jackson.annotation.JsonIgnore;
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

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @ToString.Exclude
    private Lecture lecture;

    @Builder
    public Quiz(String word, String meaning) {
        this.word = word;
        this.meaning = meaning;
    }

    public void setLecture(Lecture lecture) {
        this.lecture = lecture;
        lecture.getQuizzes().add(this);
    }
}
