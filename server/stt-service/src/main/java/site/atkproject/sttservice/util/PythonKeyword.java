package site.atkproject.sttservice.util;

public class PythonKeyword extends PythonManager {

    public PythonKeyword() {
        super(PythonFileName.KEYWORD, "/app/keyword");
    }

    public String getKeyword(String content) {
        return getResult(new ProcessBuilder(homePath + PythonFileName.PYTHON.getPath(), finalPath, content));
    }

    public static void main(String[] args) {
        PythonKeyword pythonKeyword = new PythonKeyword();
        String result = pythonKeyword.getKeyword("asdfsdf asdfsdfsda");
        System.out.println(result);
    }
}
