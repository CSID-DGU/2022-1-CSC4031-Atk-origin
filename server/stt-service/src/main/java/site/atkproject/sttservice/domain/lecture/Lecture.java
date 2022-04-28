package site.atkproject.sttservice.domain.lecture;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.data.annotation.CreatedDate;
import site.atkproject.sttservice.domain.quiz.Quiz;
import site.atkproject.sttservice.domain.user.User;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@NoArgsConstructor
@Getter
@Entity
public class Lecture {

    @Id
    @GeneratedValue
    @Column(name = "lecture_id")
    private Long id;

    @Lob
    private String content;

    @Lob
    private String translation;

    private Boolean hasKeyword;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "lecture")
    private List<Quiz> quizzes = new ArrayList<>();

    @CreatedDate
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Builder
    public Lecture(String content) {
        this.content = content;
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

    public void updateTranslation(String text) {
        this.translation = text;
    }
}
