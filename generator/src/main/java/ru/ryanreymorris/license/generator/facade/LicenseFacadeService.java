package ru.ryanreymorris.license.generator.facade;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import ru.ryanreymorris.license.generator.dto.request.license.LicenseMetaRequest;
import ru.ryanreymorris.license.generator.dto.request.license.LicenseSearch;
import ru.ryanreymorris.license.generator.dto.request.license.LicenseUpdateRequest;
import ru.ryanreymorris.license.generator.dto.response.license.DecryptAndCheckResponse;
import ru.ryanreymorris.license.generator.dto.response.license.LicenseFileResponse;
import ru.ryanreymorris.license.generator.dto.response.license.LicenseMetaResponse;
import ru.ryanreymorris.license.generator.enums.LicenseType;
import ru.ryanreymorris.license.generator.exception.BadLicenseFileException;
import ru.ryanreymorris.license.generator.exception.LicenseGenerationException;
import ru.ryanreymorris.license.generator.exception.ServiceNotFoundException;
import ru.ryanreymorris.license.generator.exception.LicenseNotFoundException;
import ru.ryanreymorris.license.generator.interfaces.LicenseGenerator;
import ru.ryanreymorris.license.generator.repository.LicenseRepository;

import java.io.FileNotFoundException;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Фасад-сервис лицензий
 */
@Service
public class LicenseFacadeService {

    private final Map<LicenseType, LicenseGenerator> licenseGenerators;

    @Autowired
    private LicenseRepository licenseRepository;

    public LicenseFacadeService(Map<LicenseType, LicenseGenerator> licenseGenerators) {
        this.licenseGenerators = licenseGenerators;
    }

    public Map<LicenseType, String> getLicenseVersion() {
        return licenseGenerators
                .entrySet()
                .stream()
                .collect(Collectors.toMap(Map.Entry::getKey, e -> e.getValue().getLicenseVersion()));
    }

    /**
     * Достает все мета данные лицензий
     *
     * @return ключи
     */
    @Transactional(readOnly = true)
    public Page<LicenseMetaResponse> getAllLicenses(Pageable pageable) {
        return licenseRepository.findAll(pageable).map(LicenseMetaResponse::new);
    }

    /**
     * Достает все мета данные лицензий по типу
     *
     * @return ключи
     */
    @Transactional(readOnly = true)
    public Page<LicenseMetaResponse> getAllLicensesByType(LicenseSearch search, Pageable pageable) throws ServiceNotFoundException {
        if(search == null) {
            return getAllLicenses(pageable);
        }
        LicenseType licenseType = Optional.of(search.getLicenseType()).orElse(LicenseType.SYSTEM);
        if (licenseGenerators.containsKey(licenseType)) {
            return licenseGenerators.get(licenseType).findAllByLicenseType(search, pageable).map(LicenseMetaResponse::new);
        }
        throw new ServiceNotFoundException("Такого сервиса не существует");
    }

    /**
     * Скачивает лицензию
     *
     * @param licenseFileId id ключа
     * @return ответ
     */
    @Transactional(readOnly = true)
    public LicenseFileResponse getLicenseFile(@PathVariable UUID licenseFileId, @RequestParam LicenseType licenseType) throws ServiceNotFoundException, FileNotFoundException, LicenseNotFoundException {
        if (licenseGenerators.containsKey(licenseType)) {
            return new LicenseFileResponse(licenseGenerators.get(licenseType).getLicenseFile(licenseFileId));
        }
        throw new ServiceNotFoundException("Такого сервиса не существует");
    }

    /**
     * Создает новую лицензию
     *
     * @param licenseMetaRequest входные данные для создания
     * @return ответ
     */
    @Transactional()
    public LicenseMetaResponse createNewLicense(LicenseType licenseType, LicenseMetaRequest licenseMetaRequest,
                                                MultipartFile[] files) throws LicenseGenerationException, BadLicenseFileException, ServiceNotFoundException {
        Map<String, MultipartFile> filesMap = Arrays.stream(files).collect(Collectors.toMap(MultipartFile::getOriginalFilename, file -> file));
        if (licenseGenerators.containsKey(licenseType)) {
            return new LicenseMetaResponse(licenseGenerators.get(licenseType).generate(licenseMetaRequest, filesMap));
        }
        throw new ServiceNotFoundException("Такого сервиса не существует");
    }

    /**
     * Обновляет лицензию
     *
     * @return ответ - расшифрованная лицензия
     */
    @Transactional()
    public LicenseMetaResponse update(LicenseType licenseType,
                                      LicenseUpdateRequest licenseUpdateRequest,
                                      MultipartFile[] files) throws ServiceNotFoundException, LicenseGenerationException, LicenseNotFoundException {
        Map<String, MultipartFile> filesMap = Arrays.stream(files).collect(Collectors.toMap(MultipartFile::getOriginalFilename, file -> file));
        if (licenseGenerators.containsKey(licenseType)) {
            return new LicenseMetaResponse(licenseGenerators.get(licenseType)
                    .updateLicense(licenseUpdateRequest.getId(), licenseUpdateRequest.getDateOfExpiry(), filesMap.get("privateKey")));
        }
        throw new ServiceNotFoundException("Такого сервиса не существует");
    }

    /**
     * Расшифровывает лицензию
     *
     * @return ответ - расшифрованная лицензия
     */
    @Transactional()
    public DecryptAndCheckResponse decryptAndCheck(LicenseType licenseType, MultipartFile[] files) throws BadLicenseFileException, ServiceNotFoundException {
        Map<String, MultipartFile> filesMap = Arrays.stream(files).collect(Collectors.toMap(MultipartFile::getOriginalFilename, file -> file));
        if (licenseGenerators.containsKey(licenseType)) {
            return licenseGenerators.get(licenseType).decryptAndCheck(filesMap);
        }
        throw new ServiceNotFoundException("Такого сервиса не существует");
    }

    /**
     * Удаление лицензии и связанных с ней файлов
     */
    @Transactional()
    public void deleteById(LicenseType licenseType, UUID licenseId) throws ServiceNotFoundException, LicenseNotFoundException {
        if (licenseGenerators.containsKey(licenseType)) {
            licenseGenerators.get(licenseType).deleteById(licenseId);
        } else {
            throw new ServiceNotFoundException("Такого сервиса не существует");
        }
    }

    public List<String> getSortedIssuers() {
        return licenseGenerators.get(LicenseType.SYSTEM).getSortedIssuers();
    }
}
