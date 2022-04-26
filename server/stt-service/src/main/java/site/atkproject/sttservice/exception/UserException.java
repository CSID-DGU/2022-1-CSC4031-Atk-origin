package site.atkproject.sttservice.exception;

public class UserException extends RuntimeException {

    private String username;

    public UserException(String msg, String username) {
        super(msg);
        this.username = username;
    }

    public String getUsername() {
        return username;
    }
}
