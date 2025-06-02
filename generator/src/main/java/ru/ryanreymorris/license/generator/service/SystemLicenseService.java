package ru.ryanreymorris.license.generator.service;

import javax0.license3j.Feature;
import javax0.license3j.License;
import javax0.license3j.crypto.LicenseKeyPair;
import javax0.license3j.io.IOFormat;
import javax0.license3j.io.KeyPairReader;
import javax0.license3j.io.LicenseReader;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import ru.ryanreymorris.license.generator.dto.request.license.LicenseMetaRequest;
import ru.ryanreymorris.license.generator.dto.request.license.LicenseSearch;
import ru.ryanreymorris.license.generator.dto.response.license.DecryptAndCheckResponse;
import ru.ryanreymorris.license.generator.dto.response.license.LicenseMetaResponse;
import ru.ryanreymorris.license.generator.dto.response.license.LicenseStatus;
import ru.ryanreymorris.license.generator.entity.LicenseFile;
import ru.ryanreymorris.license.generator.entity.LicenseMeta;
import ru.ryanreymorris.license.generator.entity.Property;
import ru.ryanreymorris.license.generator.entity.User;
import ru.ryanreymorris.license.generator.enums.FileType;
import ru.ryanreymorris.license.generator.enums.LicenseType;
import ru.ryanreymorris.license.generator.exception.BadLicenseFileException;
import ru.ryanreymorris.license.generator.exception.LicenseGenerationException;
import ru.ryanreymorris.license.generator.exception.LicenseNotFoundException;
import ru.ryanreymorris.license.generator.interfaces.LicenseGenerator;
import ru.ryanreymorris.license.generator.repository.LicenseFileRepository;
import ru.ryanreymorris.license.generator.repository.LicenseRepository;
import ru.ryanreymorris.license.generator.repository.PropertyRepository;
import ru.ryanreymorris.license.generator.repository.UserRepository;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Base64;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.TimeZone;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Сервия для генерации лицензий SYSTEM
 */
@Service
public class SystemLicenseService implements LicenseGenerator {

    private static final Logger logger = LoggerFactory.getLogger(SystemLicenseService.class);
    private static final String LICENSE_NUMBER_PROP_KEY = "licenseNumber";
    private static final String VERSION_PROP_KEY = "version";
    private static final String LICENSE_VERSION = "v2";
    private static final String DIGEST = "SHA-512";
    private static final List<String> exceptedProps = Arrays.asList(LICENSE_NUMBER_PROP_KEY, VERSION_PROP_KEY);
    private static final SimpleDateFormat SIMPLE_DATE_FORMAT = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSZ");
    static {
        SIMPLE_DATE_FORMAT.setTimeZone(TimeZone.getDefault());
    }

    @Autowired
    private LicenseRepository licenseRepository;
    @Autowired
    private LicenseFileRepository licenseFileRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PropertyRepository propertyRepository;

    /**
     * {@inheritDoc}
     */
    @Override
    public LicenseType getLicenseType() {
        return LicenseType.SYSTEM;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public String getLicenseVersion() {
        return LICENSE_VERSION;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = true)
    public Page<LicenseMeta> findAll(Pageable pageable) {
        return licenseRepository.findAll(pageable);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = true)
    public Page<LicenseMeta> findAllByLicenseType(LicenseSearch search, Pageable pageable) {
        if (search.getReal() && search.getActive()) {
            return licenseRepository.findRealAndActiveByLicenseType(getLicenseType(), new Date(), pageable);
        } else if (search.getReal() && !search.getActive()) {
            return licenseRepository.findRealByLicenseType(getLicenseType(), pageable);
        } else if (!search.getReal() && search.getActive()) {
            return licenseRepository.findActiveByLicenseType(getLicenseType(), new Date(), pageable);
        } else {
            return licenseRepository.findAllByLicenseType(getLicenseType(), pageable);
        }
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = true)
    public LicenseFile getLicenseFile(UUID licenseFileId) throws LicenseNotFoundException {
        return licenseFileRepository.findById(licenseFileId)
                .orElseThrow(() -> new LicenseNotFoundException("Лицензия с id " + licenseFileId + "не найдена"));
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public DecryptAndCheckResponse decryptAndCheck(Map<String, MultipartFile> files) throws BadLicenseFileException {
        DecryptAndCheckResponse response = new DecryptAndCheckResponse();
        try (LicenseReader reader = new LicenseReader(files.get("licenseFile").getInputStream())) {
            License license = reader.read(IOFormat.BASE64);
            response.setDecryptedLicense(license.getFeatures().entrySet().stream()
                    .collect(Collectors.toMap(Map.Entry::getKey, prop -> {
                        if (prop.getValue().isDate()) {
                            return SIMPLE_DATE_FORMAT.format(prop.getValue().getDate());
                        } else if (prop.getValue().isUUID()) {
                            return prop.getValue().getUUID().toString();
                        } else if (prop.getValue().isBinary()) {
                            return Base64.getEncoder().encodeToString(prop.getValue().getBinary());
                        } else {
                            return prop.getValue().getString();
                        }
                    }))
            );
            try (KeyPairReader keyPairReader = new KeyPairReader(files.get("publicKeyFile").getInputStream())) {
                LicenseStatus licenseStatus = new LicenseStatus();
                licenseStatus.setStatus(license.isOK(keyPairReader.readPublic().getPair().getPublic()));
                if (licenseStatus.getStatus()) {
                    licenseStatus.setMessage("Лицензия валидна");
                } else {
                    licenseStatus.setMessage("Лицензия не валидна");
                }
                response.setLicenseStatus(licenseStatus);
                return response;
            } catch (InvalidKeySpecException | NoSuchAlgorithmException e) {
                logger.error(e.getLocalizedMessage());
                throw new BadLicenseFileException("Был предоставлен не верный файл открытого ключа", e);
            }
        } catch (IllegalArgumentException | IOException e) {
            logger.error(e.getLocalizedMessage());
            throw new BadLicenseFileException("Файл лицензии не смог расшифроваться или был предоставлен не правильный файл", e);
        }
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional
    public void deleteById(UUID licenseId) throws LicenseNotFoundException {
        LicenseMeta licenseMeta = licenseRepository.findById(licenseId)
                .orElseThrow(() -> new LicenseNotFoundException("Лицензия с id " + licenseId + "не найдена"));
        licenseRepository.delete(licenseMeta);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional()
    public LicenseMeta generate(LicenseMetaRequest licenseInputParams, Map<String, MultipartFile> files) throws LicenseGenerationException, BadLicenseFileException {
        LicenseMeta licenseMeta = new LicenseMeta(licenseInputParams);
        licenseMeta.setId(UUID.randomUUID());
        licenseMeta.setDateOfIssue(new Date());
        licenseMeta.setLicenseType(getLicenseType());
        List<Property> props = licenseMeta.getProperties();
        props.removeIf(prop -> exceptedProps.contains(prop.getKey()) || prop.getValue() == null);
        props.add(new Property(VERSION_PROP_KEY, getLicenseVersion()));
        props.add(new Property(LICENSE_NUMBER_PROP_KEY, String.valueOf(licenseRepository.count() + 1)));
        licenseMeta.setProperties(props);
        List<LicenseFile> filesToSave = new ArrayList<>();
        if (files != null) {
            if (files.containsKey("privateKey")) {
                License license = generateLicense(licenseMeta, files.get("privateKey"));
                LicenseFile licenseFile = new LicenseFile(
                        licenseInputParams.getProperties()
                                .getOrDefault(licenseInputParams.getProperties().get(exceptedProps.get(0)),
                                        "SYSTEM_LICENSE_" + new Date()),
                        FileType.LICENSE_FILE,
                        MediaType.APPLICATION_OCTET_STREAM_VALUE,
                        Base64.getEncoder().encode(license.serialized())
                );
                filesToSave.add(licenseFile);
                if (files.containsKey("publicKey")) {
                    try {
                        LicenseFile publicKey = new LicenseFile(
                                "public.Key",
                                FileType.PUBLIC_KEY,
                                MediaType.APPLICATION_OCTET_STREAM_VALUE,
                                files.get("publicKey").getBytes()
                        );
                        filesToSave.add(publicKey);
                    } catch (IOException e) {
                        throw new BadLicenseFileException("Предоставлен не исправный публичный ключ");
                    }
                } else {
                    throw new BadLicenseFileException("Не предоставлен публичный ключ");
                }
            } else {
                throw new BadLicenseFileException("Не предоставлен приватный ключ");
            }
        }
        licenseMeta.setFiles(filesToSave);
        licenseMeta = licenseRepository.save(licenseMeta);
        User currentUser = getCurrentUser();
        currentUser.getLicenses().add(licenseMeta);
        userRepository.save(currentUser);
        return licenseMeta;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional()
    public LicenseMeta updateLicense(UUID licenseId, Date dateOfExpiry, MultipartFile privateKey) throws LicenseGenerationException, LicenseNotFoundException {
        LicenseMeta licenseMeta = licenseRepository.findById(licenseId)
                .orElseThrow(() -> new LicenseNotFoundException("Лицензия с id " + licenseId + "не найдена"));
        List<Property> props = licenseMeta.getProperties();
        props.removeIf(prop -> prop.getKey().equals(LICENSE_NUMBER_PROP_KEY));
        props.add(new Property(LICENSE_NUMBER_PROP_KEY, String.valueOf(licenseRepository.count() + 1)));
        licenseMeta.setProperties(props);
        LicenseMetaResponse licenseMetaResponse = new LicenseMetaResponse(licenseMeta);
        licenseMetaResponse.setPreviousLicense(licenseMetaResponse.getId());
        licenseMetaResponse.setId(UUID.randomUUID());
        licenseMetaResponse.setDateOfIssue(new Date());
        licenseMetaResponse.setDateOfExpiry(dateOfExpiry);
        LicenseMeta licenseMetaNew = new LicenseMeta(licenseMetaResponse);
        License license = generateLicense(licenseMetaNew, privateKey);
        List<LicenseFile> filesToSave = new ArrayList<>();
        LicenseFile licenseFile = new LicenseFile(
                licenseMetaResponse.getProperties()
                        .getOrDefault(licenseMetaResponse.getProperties().get(exceptedProps.get(0)),
                                "SYSTEM_LICENSE_" + new Date().toString()),
                FileType.LICENSE_FILE,
                MediaType.APPLICATION_OCTET_STREAM_VALUE,
                Base64.getEncoder().encode(license.serialized())
        );
        filesToSave.add(licenseFile);
        Optional<LicenseFile> publicKey = licenseMeta.getFiles().stream()
                .filter(file -> file.getFileType().equals(FileType.PUBLIC_KEY))
                .findFirst();
        LicenseFile publicKeyFile = new LicenseFile(publicKey.get());
        filesToSave.add(publicKeyFile);
        licenseMetaNew.setFiles(filesToSave);
        licenseMetaNew = licenseRepository.save(licenseMetaNew);
        User currentUser = getCurrentUser();
        currentUser.getLicenses().add(licenseMetaNew);
        userRepository.save(currentUser);
        return licenseMetaNew;
    }

    @Override
    public List<String> getSortedIssuers() {
        return propertyRepository.getIssuersUsing();
    }

    /**
     * Генерирует лицензию
     *
     * @param licenseMeta - входные данные
     * @return - лицензия
     * @throws LicenseGenerationException - выбрасывается, если что пошло не так во время генерации
     */
    private License generateLicense(LicenseMeta licenseMeta, MultipartFile privateKey) throws LicenseGenerationException {
        License license = new License();
        license.add(Feature.Create.from("id:UUID=" + licenseMeta.getId()));
        if (licenseMeta.getPreviousLicense() != null) {
            license.add(Feature.Create.from("previousLicense:UUID=" + licenseMeta.getPreviousLicense()));
        }
        license.add(Feature.Create.dateFeature("dateOfIssue", licenseMeta.getDateOfIssue()));
        if (licenseMeta.getDateOfExpiry() != null) {
            license.add(Feature.Create.dateFeature("dateOfExpiry", licenseMeta.getDateOfExpiry()));
        }
        licenseMeta.getProperties()
                .forEach(property -> license.add(
                                Feature.Create.stringFeature(
                                        property.getKey(),
                                        Optional.ofNullable(property.getValue()).orElse("")
                                )
                        )
                );
        try (final KeyPairReader privateKeyReader = new KeyPairReader(privateKey.getInputStream())) {
            LicenseKeyPair privateKeyPair = privateKeyReader.readPrivate();
            license.sign(privateKeyPair.getPair().getPrivate(), DIGEST);
        } catch (IllegalBlockSizeException | BadPaddingException | NoSuchPaddingException | FileNotFoundException e) {
            throw new LicenseGenerationException("Предоставлен не исправный приватный ключ");
        } catch (IOException | InvalidKeySpecException | NoSuchAlgorithmException | InvalidKeyException e) {
            throw new LicenseGenerationException("Не получилось подписать лицензию");
        }
        return license;
    }

    private User getCurrentUser() {
        Optional<User> currentUser = userRepository.findByUsername(SecurityContextHolder.getContext().getAuthentication().getName());
        if (currentUser.isEmpty()) {
            throw new UsernameNotFoundException("При генерации лицензии пользователй не был найден");
        }
        return currentUser.get();
    }
}
