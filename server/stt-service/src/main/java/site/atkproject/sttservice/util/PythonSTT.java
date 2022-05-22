package site.atkproject.sttservice.util;

public class PythonSTT extends PythonManager {

    public PythonSTT() {
        super(PythonFileName.STT, "/app/stt");
    }

    public String getSTT(String fileName) {
        int INDEXING = 7;
        String result =  getResult(new ProcessBuilder(homePath + PythonFileName.PYTHON.getPath(), finalPath, fileName));
        System.out.println(result);
        int i = result.indexOf("result=") + INDEXING;
        result = result.substring(i);
        return result;
    }

    public static void main(String[] args) {
        PythonSTT pythonSTT = new PythonSTT();
        long start = System.currentTimeMillis();
        pythonSTT.getSTT("seokju/testaudio.wav");
        System.out.println((System.currentTimeMillis() - start)/1000);
    }
}
