package ru.ryanreymorris.license.generator.controllers;

import jakarta.validation.Valid;
import jakarta.websocket.server.PathParam;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
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
import ru.ryanreymorris.license.generator.exception.LicenseNotFoundException;
import ru.ryanreymorris.license.generator.exception.ServiceNotFoundException;
import ru.ryanreymorris.license.generator.facade.LicenseFacadeService;

import java.io.FileNotFoundException;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Котроллер для работы с ключами
 */
@RestController
@RequestMapping("/api/license")
public class LicenseController {

    final LicenseFacadeService licenseFacadeService;

    public LicenseController(LicenseFacadeService licenseFacadeService) {
        this.licenseFacadeService = licenseFacadeService;
    }

    /**
     * Возвращает версию запрошенной лицензии
     *
     * @return Версия
     */
    @GetMapping("/version")
    public ResponseEntity<Map<LicenseType, String>> getLicenseVersion() {
        return ResponseEntity.ok(licenseFacadeService.getLicenseVersion());
    }

    /**
     * Достать все мета данные ключей
     *
     * @return ключи
     */
    @GetMapping("")
    public ResponseEntity<Page<LicenseMetaResponse>> getAllLicenses(@RequestParam(required = false) LicenseType licenseType, Pageable pageable) throws ServiceNotFoundException {
        return ResponseEntity.ok(licenseFacadeService.getAllLicenses(pageable));
    }

    /**
     * Достать все мета данные ключей
     *
     * @return ключи
     */
    @GetMapping("/list")
    public ResponseEntity<Page<LicenseMetaResponse>> getAllLicenses(LicenseSearch search, Pageable pageable) throws ServiceNotFoundException {
        return ResponseEntity.ok(licenseFacadeService.getAllLicensesByType(search, pageable));
    }

    /**
     * Скачать ключ
     *
     * @param licenseFileId id ключа
     * @return ответ
     */
    @GetMapping("/download/{licenseFileId:.+}")
    public ResponseEntity<ByteArrayResource> downloadLicenseFile(@PathVariable UUID licenseFileId, @RequestParam LicenseType licenseType) throws ServiceNotFoundException, FileNotFoundException, LicenseNotFoundException {
        LicenseFileResponse licenseFile = licenseFacadeService.getLicenseFile(licenseFileId, licenseType);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(licenseFile.getDataType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, String.format("attachment; filename=\"%s\"", licenseFile.getFileName()))
                .header(HttpHeaders.ACCESS_CONTROL_EXPOSE_HEADERS, HttpHeaders.CONTENT_DISPOSITION)
                .body(new ByteArrayResource(licenseFile.getData()));
    }

    /**
     * Создать новый ключ
     *
     * @param licenseMetaRequest входные данные для создания
     * @return ответ
     */
    @PostMapping(value = "/create", consumes = {"multipart/form-data", "application/octet-stream"})
    @ResponseBody
    public ResponseEntity<LicenseMetaResponse> createNewLicense(@PathParam("licenseType") LicenseType licenseType,
                                                                @RequestPart("licenseMeta") @Valid LicenseMetaRequest licenseMetaRequest,
                                                                @RequestPart(value = "files", required = false) MultipartFile[] files) throws LicenseGenerationException, BadLicenseFileException, ServiceNotFoundException {
        return ResponseEntity.ok(licenseFacadeService.createNewLicense(licenseType, licenseMetaRequest, files));
    }

    /**
     * Расшифровывает лицензию
     *
     * @return ответ - расшифрованная лицензия
     */
    @PostMapping(value = "/update", consumes = {"multipart/form-data", "application/octet-stream"})
    @ResponseBody
    public ResponseEntity<LicenseMetaResponse> update(@PathParam("licenseType") LicenseType licenseType,
                                                      @RequestPart("licenseMeta") @Valid LicenseUpdateRequest licenseUpdateRequest,
                                                      @RequestPart(value = "files", required = false) MultipartFile[] files) throws ServiceNotFoundException, LicenseGenerationException, LicenseNotFoundException {
        return ResponseEntity.ok(licenseFacadeService.update(licenseType, licenseUpdateRequest, files));
    }

    /**
     * Расшифровывает лицензию
     *
     * @return ответ - расшифрованная лицензия
     */
    @PostMapping(value = "/decryptAndCheck", consumes = {"multipart/form-data", "application/octet-stream"})
    @ResponseBody
    public ResponseEntity<DecryptAndCheckResponse> decryptAndCheck(@PathParam("licenseType") LicenseType licenseType,
                                                                   @RequestPart(value = "files") MultipartFile[] files) throws BadLicenseFileException, ServiceNotFoundException {
        return ResponseEntity.ok(licenseFacadeService.decryptAndCheck(licenseType, files));
    }

    /**
     * Удаление лицензии и связанных с ней файлов
     */
    @GetMapping(value = "/delete/{licenseId}")
    public ResponseEntity<DecryptAndCheckResponse> deleteById(@PathParam("licenseType") LicenseType licenseType,
                                                              @PathVariable UUID licenseId) throws ServiceNotFoundException, LicenseNotFoundException {
        licenseFacadeService.deleteById(licenseType, licenseId);
        return ResponseEntity.ok().build();
    }

    /**
     * Возвращает список подсказказок для поля Выпущено
     */
    @GetMapping(value = "/issuers")
    public ResponseEntity<List<String>> getSortedIssuers() {
        return ResponseEntity.ok(licenseFacadeService.getSortedIssuers());
    }
}
