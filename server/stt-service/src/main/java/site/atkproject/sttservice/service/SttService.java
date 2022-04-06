package site.atkproject.sttservice.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.*;

@RequiredArgsConstructor
@Service
public class SttService {

    public static void sendTextToSTTMachine() throws IOException, InterruptedException {
        String command = "/opt/homebrew/bin/python3";  // 명령어
        String arg1 = "~/test.py"; // 인자
        ProcessBuilder builder = new ProcessBuilder(command, arg1);
        Process process = builder.start();
        int exitVal = process.waitFor();  // 자식 프로세스가 종료될 때까지 기다림
        BufferedReader br = new BufferedReader(new InputStreamReader(process.getInputStream(), "euc-kr")); // 서브 프로세스가 출력하는 내용을 받기 위해
        String line;
        while ((line = br.readLine()) != null) {
            System.out.println(">>>  " + line); // 표준출력에 쓴다
        }
        if(exitVal != 0) {
            // 비정상 종료
            System.out.println("서브 프로세스가 비정상 종료되었다.");
        }
    }

    public static void main(String[] args)
            throws IOException,    InterruptedException {
        String[] command = new String[] { "echo", "hello" };
        SttService runner = new SttService();
        runner.byRuntime(command);
        runner.byProcessBuilder(command);
//        runner.byProcessBuilderRedirect(command);
    }

    public void byRuntime(String[] command)
            throws IOException, InterruptedException {
        Runtime runtime = Runtime.getRuntime();
        Process process = runtime.exec(command);
        printStream(process);
    }

    public void byProcessBuilder(String[] command)
            throws IOException,InterruptedException {
        ProcessBuilder builder = new ProcessBuilder(command);
        Process process = builder.start();
        printStream(process);
    }

    private void printStream(Process process)
            throws IOException, InterruptedException {
        process.waitFor();
        try (InputStream psout = process.getInputStream()) {
            copy(psout, System.out);
        }
    }

    public void copy(InputStream input, OutputStream output) throws IOException {
        byte[] buffer = new byte[1024];
        int n = 0;
        while ((n = input.read(buffer)) != -1) {
            output.write(buffer, 0, n);
        }
    }
}
