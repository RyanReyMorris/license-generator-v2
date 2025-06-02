package ru.ryanreymorris.license.generator.interfaces;

import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.lang.Nullable;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import ru.ryanreymorris.license.generator.dto.request.license.LicenseMetaRequest;
import ru.ryanreymorris.license.generator.dto.request.license.LicenseSearch;
import ru.ryanreymorris.license.generator.dto.response.license.DecryptAndCheckResponse;
import ru.ryanreymorris.license.generator.entity.LicenseFile;
import ru.ryanreymorris.license.generator.entity.LicenseMeta;
import ru.ryanreymorris.license.generator.enums.LicenseType;
import ru.ryanreymorris.license.generator.exception.BadLicenseFileException;
import ru.ryanreymorris.license.generator.exception.LicenseGenerationException;
import ru.ryanreymorris.license.generator.exception.LicenseNotFoundException;

import java.io.FileNotFoundException;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Общий интерфейс для сервисов генерации лицензий
 */
public interface LicenseGenerator {

    /**
     * Имя сервиса
     *
     * @return имя
     */
    LicenseType getLicenseType();

    /**
     * Версия лицензии
     */
    String getLicenseVersion();

    /**
     * Достать все мета данные лицензий
     *
     * @return ключи
     */
    @Transactional(readOnly = true)
    Page<LicenseMeta> findAll(Pageable pageable);

    /**
     * Достать все мета данные лицензии по типу лицензии
     *
     * @return ключи
     */
    @Transactional(readOnly = true)
    Page<LicenseMeta> findAllByLicenseType(LicenseSearch search, Pageable pageable);

    /**
     * Скачать файл по ID
     *
     * @param licenseFileId id ключа
     * @return ответ
     */
    @Transactional(readOnly = true)
    LicenseFile getLicenseFile(UUID licenseFileId) throws FileNotFoundException, LicenseNotFoundException;

    /**
     * Создать новую лицензию
     *  @param licenseInputParams входные данные для создания
     * @param files
     */
    @Transactional()
    LicenseMeta generate(@Valid LicenseMetaRequest licenseInputParams, @Nullable Map<String, MultipartFile> files) throws LicenseGenerationException, BadLicenseFileException;

    /**
     * продлевает лицензию
     *
     * @param id лицензии
     * @param dateOfExpiry новая дата истечения
     */
    @Transactional()
    LicenseMeta updateLicense(UUID id, Date dateOfExpiry, MultipartFile privateKey) throws LicenseGenerationException, LicenseNotFoundException;

    /**
     * Проверка лицензии на валидность
     * @return
     */
    @Transactional()
    DecryptAndCheckResponse decryptAndCheck(Map<String, MultipartFile> files) throws BadLicenseFileException;

    /**
     * Удаление лицензии и связанных с ней файлов
     */
    @Transactional()
    void deleteById(UUID licenseId) throws LicenseNotFoundException;

    /**
     * Возвращает список значения применяемых для поля "Выпущено" в порядке уменшения частоты использования
     * @return
     */
    List<String> getSortedIssuers();
}
