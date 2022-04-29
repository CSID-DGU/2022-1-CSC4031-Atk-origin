package site.atkproject.sttservice.util;

import lombok.NoArgsConstructor;

public class PythonKeyword extends PythonManager {

    public PythonKeyword() {
        super("/app/keyword/test.py");
    }

    public String getKeyword(String content) {
        PythonKeyword pythonKeyword = new PythonKeyword();
        return pythonKeyword.getResult(new ProcessBuilder("python", finalPath, content));
    }
}
