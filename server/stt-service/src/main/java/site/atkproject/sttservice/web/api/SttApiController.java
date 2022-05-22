package site.atkproject.sttservice.web.api;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import site.atkproject.sttservice.domain.lecture.Lecture;
import site.atkproject.sttservice.service.SttService;
import site.atkproject.sttservice.util.SocketTest;
import site.atkproject.sttservice.web.dto.request.SttStartRequestDto;
import site.atkproject.sttservice.web.dto.response.BasicResponseDto;
import site.atkproject.sttservice.web.dto.response.SttResultResponseDto;
import site.atkproject.sttservice.web.dto.response.SttStartResponseDto;

import java.io.IOException;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/stt")
public class SttApiController {

    private final SttService sttService;
    private final SocketTest socketTest;

    @PostMapping("")
    public BasicResponseDto<SttStartResponseDto> startStt(@RequestBody SttStartRequestDto sttStartRequestDto) {
        Lecture lecture = sttService.startStt(sttStartRequestDto);
        SttStartResponseDto result = SttStartResponseDto.builder().id(lecture.getId()).title(lecture.getTitie()).build();
        return new BasicResponseDto<>(BasicResponseDto.SUCCESS, BasicResponseDto.STT, result);
    }

    @PostMapping("/{lectureId}")
    public BasicResponseDto<SttResultResponseDto> doStt(@RequestParam MultipartFile file, @PathVariable Long lectureId) throws IOException {

        String result = "";
        if (!file.isEmpty()) {
            result = sttService.doSTT(file, lectureId);
        }
        return new BasicResponseDto<>(BasicResponseDto.SUCCESS, BasicResponseDto.STT, new SttResultResponseDto(lectureId, result));
    }

    @GetMapping("")
    public String testWebclient() {
        return socketTest.getStt();
    }
}
