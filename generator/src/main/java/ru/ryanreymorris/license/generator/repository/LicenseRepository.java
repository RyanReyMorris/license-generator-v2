package ru.ryanreymorris.license.generator.repository;



import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import ru.ryanreymorris.license.generator.entity.LicenseMeta;
import ru.ryanreymorris.license.generator.enums.LicenseType;

import java.util.Date;
import java.util.UUID;

/**
 * DAO для мета данных ключа
 *
 * @author DSalikhov
 */
@Repository
@Transactional
public interface LicenseRepository extends JpaRepository<ru.ryanreymorris.license.generator.entity.LicenseMeta, UUID> {

    @Query("select l from LicenseMeta l left join Property p on p.licenseMeta = l and (p.key = 'testLicense' and p.value = 'true') where l.licenseType=?1 and p is null and l.dateOfExpiry > ?2")
    Page<ru.ryanreymorris.license.generator.entity.LicenseMeta> findRealAndActiveByLicenseType(ru.ryanreymorris.license.generator.enums.LicenseType type, Date date, Pageable pageable);

    @Query("select l from LicenseMeta l where l.licenseType=?1 and l.dateOfExpiry > ?2")
    Page<ru.ryanreymorris.license.generator.entity.LicenseMeta> findActiveByLicenseType(ru.ryanreymorris.license.generator.enums.LicenseType type, Date date, Pageable pageable);

    @Query("select l from LicenseMeta l left join Property p on p.licenseMeta = l and (p.key = 'testLicense' and p.value = 'true') where l.licenseType=?1 and p is null")
    Page<ru.ryanreymorris.license.generator.entity.LicenseMeta> findRealByLicenseType(ru.ryanreymorris.license.generator.enums.LicenseType type, Pageable pageable);

    Page<ru.ryanreymorris.license.generator.entity.LicenseMeta> findAllByLicenseType(LicenseType type, Pageable pageable);
}
