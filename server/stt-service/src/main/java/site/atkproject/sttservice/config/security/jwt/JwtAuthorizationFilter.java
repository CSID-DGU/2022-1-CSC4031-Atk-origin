package site.atkproject.sttservice.config.security.jwt;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import site.atkproject.sttservice.config.security.auth.PrincipalDetails;
import site.atkproject.sttservice.domain.user.User;
import site.atkproject.sttservice.domain.user.UserRepository;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Slf4j
public class JwtAuthorizationFilter extends BasicAuthenticationFilter {

    private JwtProperties jwtProperties;
    private UserRepository userRepository;

    public JwtAuthorizationFilter(AuthenticationManager authenticationManager, UserRepository userRepository, JwtProperties jwtProperties) {
        super(authenticationManager);
        this.userRepository = userRepository;
        this.jwtProperties = jwtProperties;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws IOException, ServletException {
        log.info("인가 시도");
        String jwtHeader = request.getHeader("Authorization");
        log.info("jwtHeader {}", jwtHeader);

        if (jwtHeader == null || !jwtHeader.startsWith(jwtProperties.getTOKEN_PREFIX())) {
            log.info("jwtHeader is null {}", jwtHeader);
            chain.doFilter(request, response);
            return;
        }

        String jwtToken = request.getHeader("Authorization").replace(jwtProperties.getTOKEN_PREFIX(), "");

        String username = JWT.require(Algorithm.HMAC512(jwtProperties.getHashKey())).build().verify(jwtToken)
                .getClaim("username")
                .asString();

        if (username != null) {
            User userEntity = userRepository.findByUsername(username);

            PrincipalDetails principalDetails = new PrincipalDetails(userEntity);
            Authentication authentication = new UsernamePasswordAuthenticationToken(principalDetails, null, principalDetails.getAuthorities());

            SecurityContextHolder.getContext().setAuthentication(authentication);
        }
        chain.doFilter(request, response);
    }
}
