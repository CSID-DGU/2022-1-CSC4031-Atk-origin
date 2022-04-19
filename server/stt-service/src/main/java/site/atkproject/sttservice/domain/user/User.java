package site.atkproject.sttservice.domain.user;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import site.atkproject.sttservice.domain.lecture.Lecture;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Getter
@NoArgsConstructor
@Entity
public class User {

    @Id
    @GeneratedValue
    @Column(name = "user_id")
    private Long id;

    private String username;
    private String password;
    private String roles;

    @OneToMany(mappedBy = "user")
    private List<Lecture> lectures = new ArrayList<>();

    public List<String> getRoleList() {
        if (this.roles.length() > 0) {
            return Arrays.asList(this.roles.split(","));
        } else {
            return new ArrayList<>();
        }
    }

    @Builder
    public User(String username, String password, String roles) {
        this.username = username;
        this.password = password;
        this.roles = roles;
    }
}
