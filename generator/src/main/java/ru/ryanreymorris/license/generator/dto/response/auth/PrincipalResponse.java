package ru.ryanreymorris.license.generator.dto.response.auth;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

/**
 * Ответ с ролями пользователя
 */
public class PrincipalResponse {

    /**
     * Логин
     */
    private String username;

    /**
     * Предоставленные права
     */
    private Collection<? extends GrantedAuthority> authorities;

    public PrincipalResponse() {
    }

    public PrincipalResponse(Authentication authentication) {
        this.username = authentication.getName();
        this.authorities = authentication.getAuthorities();
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    public void setAuthorities(Collection<? extends GrantedAuthority> authorities) {
        this.authorities = authorities;
    }
}
