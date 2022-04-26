package site.atkproject.sttservice.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Data;
import org.springframework.stereotype.Component;

import java.io.*;

@Component
public class TestPython {
    private String getTimes() {

        String filePath = "src/main/python/result.txt";

        try {
            String pythonFile = "src/main/python/test.py";
            ProcessBuilder processBuilder = new ProcessBuilder("python", pythonFile);
            processBuilder.redirectErrorStream(true);
            Process process = processBuilder.start();
            OutputStream stdin = process.getOutputStream();

            BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(stdin));
            bw.write(filePath);
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
            throw new IllegalArgumentException("북마크 생성 도중 오류가 발생했습니다.");
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

    public void getResult() throws JsonProcessingException {
        TestPython testPython = new TestPython();
        String result = testPython.getTimes();
        ObjectMapper objectMapper = new ObjectMapper();
        testDto testDto = objectMapper.readValue(result, testDto.class);
        System.out.println(result);
        System.out.println(testDto);
//        File file = new File("src/main/python.test.py");
//        System.out.println(file.getAbsolutePath());
    }

    @Data
    static class testDto {
        private String language;
        private String company;
        private Integer itemId;
        private Double price;
    }
}
