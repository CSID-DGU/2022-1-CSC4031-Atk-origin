package site.atkproject.sttservice.domain.lecture;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.DynamicInsert;
import site.atkproject.sttservice.domain.BaseTimeEntity;
import site.atkproject.sttservice.domain.quiz.Quiz;
import site.atkproject.sttservice.domain.user.User;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@NoArgsConstructor
@Getter
@DynamicInsert
@Entity
public class Lecture extends BaseTimeEntity {

    @Id
    @GeneratedValue
    @Column(name = "lecture_id")
    private Long id;

    private String titie;

    @Lob
    private String content;

    @Lob
    private String translation;

    @ColumnDefault(value = "0")
    private Boolean hasKeyword;

    @ColumnDefault(value = "0")
    private Integer score;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "lecture", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Quiz> quizzes = new ArrayList<>();

    @Builder
    public Lecture(String title, String content, String translation) {
        this.titie = title;
        this.content = content;
        this.translation = translation;
    }

    public void setUser(User user) {
        if (this.user != null) {
            this.user.getLectures().remove(this); // 관계를 끊는다.
        }
        this.user = user;
        user.getLectures().add(this);
    }

    public void updateHasKey(Boolean bool) {
        this.hasKeyword = bool;
    }

    public void updateContent(String content) {
        this.content += " " + content;
    }

    public void updateTranslation(String text) {
        this.translation = text;
    }

    public void updateScore(int score) {
        this.score = score;
    }

    @PrePersist
    public void prePersist() {
        this.content = this.content == null ? "" : this.content;
    }
}
