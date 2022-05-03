package site.atkproject.sttservice.util;

public class PythonSTT extends PythonManager {

    public PythonSTT() {
        super(PythonFileName.STT, "/app/stt");
    }

    public String getSTT(String fileName) {
        int INDEXING = 7;
        String result =  getResult(new ProcessBuilder(homePath + PythonFileName.PYTHON.getPath(), finalPath, fileName));
        int i = result.indexOf("result=") + INDEXING;
        result = result.substring(i);
        return result;
    }
}
