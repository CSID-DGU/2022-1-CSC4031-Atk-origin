package site.atkproject.sttservice.service.quiz;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.net.ssl.HttpsURLConnection;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URL;

/**
 * 옥스퍼드 API 사용
 * https://od-api.oxforddictionaries.com/api/v2/thesaurus/en/win?fields=synonyms%2Cantonyms&strictMatch=false
 */

@Component
public class ThesaurusImpl implements Thesaurus {

    @Value("${oxford.app-id}")
    private String appId;

    @Value("${oxford.app-key}")
    private String appKey;

    public String getThesaurus(String word) {
        final String fields = "synonyms,antonyms";
        final String strictMatch = "false";
        final String word_id = word.toLowerCase();
        final String restUrl = "https://od-api.oxforddictionaries.com/api/v2/thesaurus/en/"
                + word_id + "?"
                + "fields=" + fields
                + "&strictMatch=" + strictMatch;
        final String app_id = appId;
        final String app_key = appKey;
        String result = "";
        try {
            URL url = new URL(restUrl);
            HttpsURLConnection urlConnection = (HttpsURLConnection) url.openConnection();
            urlConnection.setRequestProperty("Accept", "application/json");
            urlConnection.setRequestProperty("app_id", app_id);
            urlConnection.setRequestProperty("app_key", app_key);

            // read the output from the server
            BufferedReader reader = new BufferedReader(new InputStreamReader(urlConnection.getInputStream()));
            StringBuilder stringBuilder = new StringBuilder();
            String line = null;
            while ((line = reader.readLine()) != null) {
                stringBuilder.append(line).append("\n");
            }
            result = stringBuilder.toString();
        } catch (IOException e) {
            e.printStackTrace();
        }
        System.out.println("result = " + result);
        return result;
    }
}
