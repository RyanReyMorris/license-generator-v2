package ru.ryanreymorris.license.generator.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.ryanreymorris.license.generator.entity.Role;
import ru.ryanreymorris.license.generator.interfaces.RoleName;

import java.util.Optional;
import java.util.UUID;

/**
 * DAO для ролей
 */
@Repository
public interface RoleRepository extends JpaRepository<Role, UUID> {

    Optional<Role> findByName(RoleName role);
}
