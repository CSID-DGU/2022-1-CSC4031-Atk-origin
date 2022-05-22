package site.atkproject.sttservice.domain.lecture;

import org.springframework.data.jpa.repository.JpaRepository;
import site.atkproject.sttservice.domain.user.User;

import java.util.List;

public interface LectureRepository extends JpaRepository<Lecture, Long> {

    List<Lecture> findAllByUser(User user);
}
