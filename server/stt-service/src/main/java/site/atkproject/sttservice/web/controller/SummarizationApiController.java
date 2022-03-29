package site.atkproject.sttservice.web.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/summarization")
public class SummarizationApiController {

    @GetMapping("")
    public String all() {
        return "summarize";
    }

    @PostMapping("")
    public String doSummarize() {
        return "post summarize";
    }
}
