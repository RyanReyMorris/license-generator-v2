package ru.ryanreymorris.license.generator.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.ryanreymorris.license.generator.entity.LicenseFile;

import java.util.UUID;

/**
 * DAO для файлов ключа
 */
@Repository
public interface LicenseFileRepository extends JpaRepository<LicenseFile, UUID> {
}
