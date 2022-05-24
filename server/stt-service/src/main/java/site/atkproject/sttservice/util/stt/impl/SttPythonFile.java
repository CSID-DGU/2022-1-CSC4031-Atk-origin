package site.atkproject.sttservice.util.stt.impl;

import site.atkproject.sttservice.util.PythonFileManager;
import site.atkproject.sttservice.util.PythonFileName;
import site.atkproject.sttservice.util.stt.SttManager;

public class SttPythonFile extends PythonFileManager implements SttManager {

    public SttPythonFile() {
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
        SttPythonFile pythonSTT = new SttPythonFile();
        long start = System.currentTimeMillis();
        pythonSTT.getSTT("seokju/testaudio.wav");
        System.out.println((System.currentTimeMillis() - start)/1000);
    }
}
