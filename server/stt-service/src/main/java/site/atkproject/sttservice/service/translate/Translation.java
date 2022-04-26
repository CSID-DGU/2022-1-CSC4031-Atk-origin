package site.atkproject.sttservice.service.translate;

import com.fasterxml.jackson.core.JsonProcessingException;

public interface Translation {

    public String translate(String sourceText) throws JsonProcessingException;
}
