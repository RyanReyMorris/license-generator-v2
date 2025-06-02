package ru.ryanreymorris.license.generator.dto.request.auth;

import jakarta.validation.constraints.NotEmpty;

/**
 * DTO для отправки запроса на логин
 */
public class LoginRequest {

    /**
     *  Логин пользователя
     */
    @NotEmpty
    private String username;

    /**
     * Пароль
     */
    @NotEmpty
    private String password;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
