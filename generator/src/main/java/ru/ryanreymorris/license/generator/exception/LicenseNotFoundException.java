package ru.ryanreymorris.license.generator.exception;

import java.io.IOException;

/**
 * Ошибка при не найденной лицензии в БД
 */
public class LicenseNotFoundException extends IOException {
    public LicenseNotFoundException(String msg) {
        super(msg);
    }

    public LicenseNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }

    public LicenseNotFoundException(Throwable cause) {
        super(cause);
    }
}
