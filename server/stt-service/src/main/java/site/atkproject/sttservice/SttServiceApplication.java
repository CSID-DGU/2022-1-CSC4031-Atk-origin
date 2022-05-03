package site.atkproject.sttservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableJpaAuditing
@SpringBootApplication
public class SttServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(SttServiceApplication.class, args);
    }

}
