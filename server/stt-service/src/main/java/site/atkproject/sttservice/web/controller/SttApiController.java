package site.atkproject.sttservice.web.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import site.atkproject.sttservice.service.SttService;

import java.io.File;
import java.io.IOException;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/stt")
public class SttApiController {

    @Value("${file.dir}")
    private String fileDir;
    private final SttService sttService;

    @GetMapping("")
    public String all() {
        return "all method";
    }

    @PostMapping("")
    public String doStt(@RequestParam MultipartFile file) throws IOException {
        log.info("{}", file);

        if (!file.isEmpty()) {
            log.info("파일 저장");
            String fullPath = fileDir + file.getOriginalFilename();
            file.transferTo(new File(fullPath));
            log.info("파일 저장 완료");
        }
        return "dispath post";
    }
}
