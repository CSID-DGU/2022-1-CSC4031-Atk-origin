package site.atkproject.sttservice.util;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum PythonFileName {

    PYTHON("/app/env/bin/python"),
    KEYWORD("/app/keyword/main.py"),
    STT("/app/stt/main.py");

    private final String path;
}
