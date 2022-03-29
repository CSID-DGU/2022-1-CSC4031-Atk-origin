package site.atkproject.sttservice.web.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/stt")
public class SttApiController {

    @GetMapping("")
    public String all() {
        return "all method";
    }

    @PostMapping("")
    public String doStt() {
        return "dispath post";
    }
}
