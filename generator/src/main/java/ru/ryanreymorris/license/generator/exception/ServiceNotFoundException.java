package ru.ryanreymorris.license.generator.exception;

/**
 * Ошибка, если не был найден нужный сервис для генерации
 */
public class ServiceNotFoundException extends Exception {

    public ServiceNotFoundException() {
        super();
    }

    public ServiceNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }

    public ServiceNotFoundException(String message) {
        super(message);
    }
}
