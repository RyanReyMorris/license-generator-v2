package ru.ryanreymorris.license.generator.interfaces;

import org.springframework.security.core.GrantedAuthority;

/**
 * Интерфейс для множества ролей
 */
public interface RoleName extends GrantedAuthority {

    String getCode();

    String getDescription();

    @Override
    String getAuthority();
}
