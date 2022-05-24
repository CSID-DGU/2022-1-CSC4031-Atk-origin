package site.atkproject.sttservice.util.keyword.impl;

import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;
import site.atkproject.sttservice.util.PythonFileManager;
import site.atkproject.sttservice.util.PythonFileName;
import site.atkproject.sttservice.util.keyword.Keyword;

@Component
public class KeywordPythonFile extends PythonFileManager implements Keyword {

    public KeywordPythonFile() {
        super(PythonFileName.KEYWORD, "/app/keyword");
    }

    public String getKeyword(String content) {
        return getResult(new ProcessBuilder(homePath + PythonFileName.PYTHON.getPath(), finalPath, content));
    }

    public static void main(String[] args) {
        KeywordPythonFile pythonKeyword = new KeywordPythonFile();
        String result = pythonKeyword.getKeyword("asdfsdf asdfsdfsda");
        System.out.println(result);
    }
}
