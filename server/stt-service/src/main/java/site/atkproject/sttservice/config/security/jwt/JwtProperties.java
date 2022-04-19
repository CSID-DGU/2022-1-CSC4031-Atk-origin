package site.atkproject.sttservice.config.security.jwt;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Getter
@Component
public class JwtProperties {

    @Value("${jwt.subject}")
    private String subject;

    @Value("${jwt.expire-time}")
    private int expireTime;

    @Value("${jwt.hash-key}")
    private String hashKey;

    private final String TOKEN_PREFIX = "Bearer ";
}
