package site.atkproject.sttservice.config.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.filter.CorsFilter;
import site.atkproject.sttservice.config.security.jwt.JwtAuthenticationFilter;
import site.atkproject.sttservice.config.security.jwt.JwtAuthorizationFilter;
import site.atkproject.sttservice.config.security.jwt.JwtProperties;
import site.atkproject.sttservice.domain.user.UserRepository;

@RequiredArgsConstructor
@EnableWebSecurity
public class Config extends WebSecurityConfigurerAdapter {

    private final JwtProperties jwtProperties;
    private final UserRepository userRepository;
    private final CorsFilter corsFilter;

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    public JwtAuthenticationFilter jwtAuthenticationFilter() throws Exception {
        JwtAuthenticationFilter jwtAuthenticationFilter = new JwtAuthenticationFilter(jwtProperties, authenticationManager());
        jwtAuthenticationFilter.setFilterProcessesUrl("/api/user/login");
        return jwtAuthenticationFilter;
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .addFilter(corsFilter)
                .csrf().disable()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .formLogin().disable()
                .httpBasic().disable()
                .addFilter(jwtAuthenticationFilter())
                .addFilter(new JwtAuthorizationFilter(authenticationManager(), userRepository, jwtProperties))
                .authorizeRequests()
                .antMatchers("/api/user/join").permitAll()
                .anyRequest().authenticated();
    }
}
