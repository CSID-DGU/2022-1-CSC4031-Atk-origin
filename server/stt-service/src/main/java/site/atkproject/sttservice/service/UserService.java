package site.atkproject.sttservice.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import site.atkproject.sttservice.domain.user.User;
import site.atkproject.sttservice.domain.user.UserRepository;
import site.atkproject.sttservice.web.dto.UserDto;

@RequiredArgsConstructor
@Transactional(readOnly = true)
@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    @Transactional
    public boolean joinUser(UserDto userDto) {
        User findUser = userRepository.findByUsername(userDto.getUsername());
        if (findUser != null) {
            return false;
        }
        userDto.setPassword(bCryptPasswordEncoder.encode(userDto.getPassword()));
        User user = userDto.toEntity();
        userRepository.save(user);
        return true;
    }
}
