package site.atkproject.sttservice.web.api;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import site.atkproject.sttservice.exception.WrongInputException;

@Slf4j
@RestController
@RequestMapping("/api/exception")
public class ExceptionApiController {

    @GetMapping("/wrong-username-or-password")
    public void wrongInputUsernameOrPassword() {
        log.info("wrong-username");
        throw new WrongInputException();
    }
}
