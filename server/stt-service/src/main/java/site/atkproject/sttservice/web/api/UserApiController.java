package site.atkproject.sttservice.web.api;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import site.atkproject.sttservice.domain.user.User;
import site.atkproject.sttservice.domain.user.UserRepository;
import site.atkproject.sttservice.web.dto.UserDto;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/user")
public class UserApiController {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    @PostMapping("/join")
    public String join(@RequestBody UserDto userDto) {

        userDto.setPassword(bCryptPasswordEncoder.encode(userDto.getPassword()));
        User user = userDto.toEntity();
        userRepository.save(user);
        return "join";
    }

    @GetMapping("/all")
    public List<User> all() {
        List<User> users = userRepository.findAll();
        return users;
    }
}
