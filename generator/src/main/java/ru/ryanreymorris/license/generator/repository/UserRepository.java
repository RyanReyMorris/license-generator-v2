package ru.ryanreymorris.license.generator.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.ryanreymorris.license.generator.entity.User;


import java.util.Optional;
import java.util.UUID;

/**
 * DAO для пользователей
 */
@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByUsername(String username);
    Optional<User> findByUsernameAndPassword(String username, String password);
}
