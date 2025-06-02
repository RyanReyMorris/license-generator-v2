package ru.ryanreymorris.license.generator.dto.response.license;

public class LicenseStatus {

    /**
     * Статус валидности лицензии
     */
    private boolean status;

    /**
     * Сообщение
     */
    private String message;

    public LicenseStatus() {
    }

    public boolean getStatus() {
        return status;
    }

    public void setStatus(boolean status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
