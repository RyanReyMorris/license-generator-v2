package ru.ryanreymorris.license.generator.exception;

import java.io.IOException;

/**
 * Ошибка не правильно предоставленной лицензии или ее ключей
 */
public class BadLicenseFileException extends IOException {
    public BadLicenseFileException(String msg) {
        super(msg);
    }

    public BadLicenseFileException(String message, Throwable cause) {
        super(message, cause);
    }

    public BadLicenseFileException(Throwable cause) {
        super(cause);
    }
}
