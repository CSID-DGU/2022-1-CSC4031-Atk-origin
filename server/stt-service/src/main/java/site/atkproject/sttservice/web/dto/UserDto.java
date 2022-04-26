package site.atkproject.sttservice.web.dto;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import site.atkproject.sttservice.domain.user.User;

@NoArgsConstructor
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

    @Builder
    public UserDto(String username, String password) {
        this.username = username;
        this.password = password;
    }
}
