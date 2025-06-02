package ru.ryanreymorris.license.generator.entity;

import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.NaturalId;
import org.springframework.security.core.GrantedAuthority;
import ru.ryanreymorris.license.generator.converter.RoleConverter;
import ru.ryanreymorris.license.generator.enums.RoleNameImpl;
import ru.ryanreymorris.license.generator.interfaces.RoleName;

import java.util.UUID;

/**
 * Реализация интерфейса GrantedAuthority
 */
@Entity
@Table(name = "role")
public class Role implements GrantedAuthority {

    /**
     * ID
     */
    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    private UUID id;

    /**
     * Имя
     */
    @Convert(converter = RoleConverter.class)
    @NaturalId
    private RoleName name;

    public Role() {
    }

    public Role(RoleNameImpl name) {
        this.name = name;
    }

    public UUID getId() {
        return id;
    }

    @Override
    public String getAuthority() {
        return name.getAuthority();
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public void setName(RoleNameImpl name) {
        this.name = name;
    }
}