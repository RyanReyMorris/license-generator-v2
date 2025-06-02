package ru.ryanreymorris.license.generator.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import ru.ryanreymorris.license.generator.dto.response.MessageResponse;
import ru.ryanreymorris.license.generator.exception.BadLicenseFileException;
import ru.ryanreymorris.license.generator.exception.LicenseGenerationException;
import ru.ryanreymorris.license.generator.exception.LicenseNotFoundException;
import ru.ryanreymorris.license.generator.exception.RegisterException;
import ru.ryanreymorris.license.generator.exception.ServiceNotFoundException;
import javax.security.auth.login.LoginException;



import java.io.FileNotFoundException;

/**
 * Переводчик ошибок
 */
@RestControllerAdvice
public class GlobalControllerExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public MessageResponse processValidationError(MethodArgumentNotValidException e) {
        return new MessageResponse(e.getMessage());
    }

    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    @ExceptionHandler(LoginException.class)
    public MessageResponse handleLoginException(LoginException e) {
        return new MessageResponse(e.getMessage());
    }

    @ResponseStatus(HttpStatus.CONFLICT)
    @ExceptionHandler(RegisterException.class)
    public MessageResponse handleRegisterException(RegisterException e) {
        return new MessageResponse(e.getMessage());
    }

    @ResponseStatus(HttpStatus.NOT_FOUND)
    @ExceptionHandler(ServiceNotFoundException.class)
    public MessageResponse handleServiceNotFoundException(ServiceNotFoundException e) {
        return new MessageResponse(e.getMessage());
    }

    @ResponseStatus(HttpStatus.NOT_FOUND)
    @ExceptionHandler(FileNotFoundException.class)
    public MessageResponse handleFileNotFoundException(FileNotFoundException e) {
        return new MessageResponse(e.getMessage());
    }

    @ResponseStatus(HttpStatus.NOT_FOUND)
    @ExceptionHandler(LicenseNotFoundException.class)
    public MessageResponse handleLicenseNotFoundException(LicenseNotFoundException e) {
        return new MessageResponse(e.getMessage());
    }

    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ExceptionHandler(LicenseGenerationException.class)
    public MessageResponse handleLicenseGenerationException(LicenseGenerationException e) {
        return new MessageResponse(e.getMessage());
    }

    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ExceptionHandler(BadLicenseFileException.class)
    public MessageResponse handleBadLicenseFileException(BadLicenseFileException e) {
        return new MessageResponse(e.getMessage());
    }
}
