package site.atkproject.sttservice.web.api;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import site.atkproject.sttservice.domain.user.User;
import site.atkproject.sttservice.domain.user.UserRepository;
import site.atkproject.sttservice.exception.UserException;
import site.atkproject.sttservice.service.UserService;
import site.atkproject.sttservice.web.dto.UserDto;
import site.atkproject.sttservice.web.dto.user.JoinUserDto;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/user")
public class UserApiController {

    private final UserService userService;

    @PostMapping("/join")
    public JoinUserDto join(@RequestBody UserDto userDto) {
        JoinUserDto joinUserDto = JoinUserDto.builder().username(userDto.getUsername()).build();
        boolean isSave = userService.joinUser(userDto);
        if (!isSave) {
            throw new UserException();
        }
        joinUserDto.setMessage("회원 가입을 축하합니다.");
        return joinUserDto;
    }
}
