package site.atkproject.sttservice.domain.lecture;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureDataJpa;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class LectureRepositoryTest {

    @Autowired
    private LectureRepository lectureRepository;

    @Test
    @DisplayName("강연 입력 테스트")
    void insertTest() throws Exception {
        // given
        Lecture lecture = new Lecture();

        // when
        Lecture save = lectureRepository.save(lecture);

        // then
        System.out.println(save.getContent());
    }

}