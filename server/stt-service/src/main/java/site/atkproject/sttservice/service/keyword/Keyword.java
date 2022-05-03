package site.atkproject.sttservice.service.keyword;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import site.atkproject.sttservice.util.PythonKeyword;
import site.atkproject.sttservice.util.PythonManager;

@Component
public class Keyword {

    private final PythonKeyword pythonKeyword = new PythonKeyword();

    public String[] separateWords(String content) {
        String result = pythonKeyword.getKeyword(content);
        return result.split(",");
    }

}
