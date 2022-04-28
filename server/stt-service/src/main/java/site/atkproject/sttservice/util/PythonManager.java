package site.atkproject.sttservice.util;

import lombok.NoArgsConstructor;

import java.io.*;
import java.util.concurrent.TimeUnit;

@NoArgsConstructor
public abstract class PythonManager {

    protected String homePath = System.getProperty("user.home");
    protected String pythonPath;
    protected String finalPath;

    public PythonManager(String pythonPath) {
        this.pythonPath = pythonPath;
        this.finalPath = homePath + pythonPath;
    }

    public String getResult(ProcessBuilder processBuilder) {

        try {
            processBuilder.redirectErrorStream(true);
            Process process = processBuilder.directory(new File(homePath + "/app/keyword")).start();
            OutputStream stdin = process.getOutputStream();

            BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(stdin));
            bw.flush();
            bw.close();

            String result = getPythonStream(process.getInputStream());

            int exitCode = process.waitFor();
            if (exitCode != 0) {
                throw new IllegalArgumentException("북마크 생성 도중 오류가 발생했습니다.");
            }

            return result;
        } catch (Exception e) {
            e.printStackTrace();
            throw new IllegalArgumentException("키워드 생성 도중 오류가 발생했습니다.");
        }
    }

    public String getPythonStream(InputStream inputStream) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(inputStream));
        StringBuilder sb = new StringBuilder();
        while (true) {
            String line = br.readLine();
            if (line == null) {
                break;
            }
            sb.append(line).append("\n");
        }
        return sb.toString();
    }
}
