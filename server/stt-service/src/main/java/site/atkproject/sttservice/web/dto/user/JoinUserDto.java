package site.atkproject.sttservice.web.dto.user;

import lombok.Builder;
import lombok.Data;

@Data
public class JoinUserDto {

    private String username;
    private String message;

    @Builder
    public JoinUserDto(String username, String message) {
        this.username = username;
        this.message = message;
    }
}
