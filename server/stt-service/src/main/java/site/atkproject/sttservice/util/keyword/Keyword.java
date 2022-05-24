package site.atkproject.sttservice.util.keyword;

public interface Keyword {
    String getKeyword(String content);

    default String[] separateWords(String content) {
        String result = getKeyword(content);
        return result.split(",");
    }
}
