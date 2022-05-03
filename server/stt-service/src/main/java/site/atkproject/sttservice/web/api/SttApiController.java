package site.atkproject.sttservice.web.api;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import site.atkproject.sttservice.domain.lecture.Lecture;
import site.atkproject.sttservice.service.SttService;
import site.atkproject.sttservice.web.dto.request.SttStartRequestDto;
import site.atkproject.sttservice.web.dto.response.SttStartResponseDto;

import java.io.IOException;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/stt")
public class SttApiController {

    private final SttService sttService;

    @GetMapping("")
    public SttStartResponseDto startStt(@RequestBody SttStartRequestDto sttStartRequestDto) {
        Lecture lecture = sttService.startStt(sttStartRequestDto);
        return SttStartResponseDto.builder().id(lecture.getId()).title(lecture.getTitie()).build();
    }

    @PostMapping("/{lectureId}")
    public String doStt(@RequestParam MultipartFile file, @PathVariable Long lectureId) throws IOException {

        if (!file.isEmpty()) {
            sttService.doSTT(file, lectureId);
        }
        return "dispath post";
    }
}
