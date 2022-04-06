package site.atkproject.sttservice.web.dto;

import lombok.Data;
import site.atkproject.sttservice.domain.user.User;

@Data
public class UserDto {

    private String username;
    private String password;

    public User toEntity() {
        return User.builder()
                .username(getUsername())
                .password(getPassword())
                .roles("ROLE_USER").build();
    }
}
