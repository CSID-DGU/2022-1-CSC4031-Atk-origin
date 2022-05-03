package site.atkproject.sttservice.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import site.atkproject.sttservice.domain.lecture.Lecture;
import site.atkproject.sttservice.domain.lecture.LectureRepository;
import site.atkproject.sttservice.domain.user.User;
import site.atkproject.sttservice.domain.user.UserRepository;
import site.atkproject.sttservice.util.PythonSTT;
import site.atkproject.sttservice.web.dto.request.SttStartRequestDto;

import java.io.*;
import java.util.Optional;

@Slf4j
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Service
public class SttService {

    private final LectureRepository lectureRepository;
    private final UserRepository userRepository;
    PythonSTT pythonSTT = new PythonSTT();

    @Value("${file.dir}")
    private String homeDir;

    /**
     *
     * STT 시작, lecture 생성
     */
    @Transactional
    public Lecture startStt(SttStartRequestDto sttStartRequestDto) {
        String username = getUsername();
        User user = userRepository.findByUsername(username);
        Lecture lecture = sttStartRequestDto.toEntity();
        lecture.setUser(user);
        return lectureRepository.save(lecture);
    }

    @Transactional
    public void doSTT(MultipartFile file, Long lectureId) throws IOException {

        String fullPath = getFullPath(file);
        Optional<Lecture> optional = lectureRepository.findById(lectureId);
        Lecture lecture = null;
        if (optional.isEmpty()) {
            throw new RuntimeException("존재하지 않는 강의입니다.");
        }
        lecture = optional.get();
        saveFile(file, fullPath);
        String fileName = getUsername() + "/" + file.getOriginalFilename();
        String sttedContent = pythonSTT.getSTT(fileName);
        lecture.updateContent(sttedContent);
        boolean isDeleted = deleteFile(fullPath);
    }

    private void saveFile(MultipartFile file, String fullPath) throws IOException {
        file.transferTo(new File(fullPath));
    }

    private boolean deleteFile(String fullPath) {
        File file = new File(fullPath);
        return file.delete();
    }

    private String getFullPath(MultipartFile file) {
        String username = getUsername();

        String finalPath = homeDir + "app/stt/" + username;
        File folder = new File(finalPath);
        if (!folder.exists()) {
            try {
                folder.mkdirs();
            } catch (Exception e) {
                e.getStackTrace();
            }
        }

        String fullPath = folder.getAbsolutePath() + "/" + file.getOriginalFilename();
        return fullPath;
    }

    private String getUsername() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = userDetails.getUsername();
        return username;
    }
}
