package ru.ryanreymorris.license.generator.exception;

import java.io.IOException;

/**
 * Ошибка при генерации лицензии
 */
public class LicenseGenerationException extends IOException {
    public LicenseGenerationException(String msg) {
        super(msg);
    }

    public LicenseGenerationException(String message, Throwable cause) {
        super(message, cause);
    }

    public LicenseGenerationException(Throwable cause) {
        super(cause);
    }
}
