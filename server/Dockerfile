FROM openjdk:11-jdk

ARG JAR_FILE=stt-service/build/libs/*.jar
COPY ${JAR_FILE} app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
