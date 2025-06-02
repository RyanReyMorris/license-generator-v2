package ru.ryanreymorris.license.generator.enums;

import ru.ryanreymorris.license.generator.interfaces.RoleName;

/**
 * Роли

 */
public enum RoleNameImpl implements RoleName {

    ROLE_USER("ROLE.USER", "ROLE_USER", "Предоставляет базовые права доступа"),
    ROLE_ADMIN("ROLE.ADMIN", "ROLE_ADMIN", "Предоставляет расширенные права доступа");

    private final String code;

    private final String description;

    private final String authority;

    RoleNameImpl(String code, String authority, String desc) {
        this.code = code;
        this.authority = authority;
        this.description = desc;
    }

    @Override
    public String getCode() {
        return code;
    }

    @Override
    public String getDescription() {
        return description;
    }

    @Override
    public String getAuthority() {
        return authority;
    }
}
