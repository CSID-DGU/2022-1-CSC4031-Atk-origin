package site.atkproject.sttservice.service.translate;

import com.fasterxml.jackson.core.JsonProcessingException;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.Map;

public interface TranslationService {

    public String translate(String sourceText) throws JsonProcessingException;
}
