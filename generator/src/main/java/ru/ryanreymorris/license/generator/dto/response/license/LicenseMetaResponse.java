package ru.ryanreymorris.license.generator.dto.response.license;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import ru.ryanreymorris.license.generator.entity.LicenseFile;
import ru.ryanreymorris.license.generator.entity.LicenseMeta;
import ru.ryanreymorris.license.generator.entity.Property;
import ru.ryanreymorris.license.generator.enums.LicenseType;
import ru.ryanreymorris.license.generator.enums.FileType;

import java.util.Date;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Ответ с информацией о лицензии
 */
public class LicenseMetaResponse {

    /**
     * Идентификатор
     */
    private UUID id;

    /**
     * Тип лицензии
     */
    private LicenseType licenseType;

    /**
     * Предыдущий Идентификатор лицензии
     */
    private UUID previousLicense;

    /**
     * Дата выпуска(формат дат yyyy-MM-dd)
     */
    private Date dateOfIssue;

    /**
     * Срок действия
     */
    private Date dateOfExpiry;

    @JsonProperty("properties")
    private Map<String, String> properties;

    @JsonProperty("files")
    private Map<FileType, UUID> files;

    public LicenseMetaResponse() {
    }

    public LicenseMetaResponse(LicenseMeta licenseMeta) {
        this.id = licenseMeta.getId();
        this.licenseType = licenseMeta.getLicenseType();
        this.previousLicense = licenseMeta.getPreviousLicense();
        this.dateOfIssue = licenseMeta.getDateOfIssue();
        this.dateOfExpiry = licenseMeta.getDateOfExpiry();
        this.properties = licenseMeta.getProperties().stream().collect(Collectors.toMap(Property::getKey, Property::getValue));
        this.files = licenseMeta.getFiles().stream().collect(Collectors.toMap(LicenseFile::getFileType, LicenseFile::getId));
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public LicenseType getLicenseType() {
        return licenseType;
    }

    public void setLicenseType(LicenseType licenseType) {
        this.licenseType = licenseType;
    }

    public UUID getPreviousLicense() {
        return previousLicense;
    }

    public void setPreviousLicense(UUID previousLicense) {
        this.previousLicense = previousLicense;
    }

    public Date getDateOfIssue() {
        return dateOfIssue;
    }

    public void setDateOfIssue(Date dateOfIssue) {
        this.dateOfIssue = dateOfIssue;
    }

    public Date getDateOfExpiry() {
        return dateOfExpiry;
    }

    public void setDateOfExpiry(Date dateOfExpiry) {
        this.dateOfExpiry = dateOfExpiry;
    }

    public Map<String, String> getProperties() {
        return properties;
    }

    public void setProperties(Map<String, String> properties) {
        this.properties = properties;
    }

    public Map<FileType, UUID> getFiles() {
        return files;
    }

    public void setFiles(Map<FileType, UUID> files) {
        this.files = files;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        LicenseMetaResponse that = (LicenseMetaResponse) o;
        return new EqualsBuilder()
                .append(id, that.id)
                .append(licenseType, that.licenseType)
                .append(previousLicense, that.previousLicense)
                .append(dateOfIssue, that.dateOfIssue)
                .append(dateOfExpiry, that.dateOfExpiry)
                .append(properties, that.properties)
                .append(files, that.files)
                .isEquals();
    }

    @Override
    public int hashCode() {
        return new HashCodeBuilder(17, 37)
                .append(id)
                .append(licenseType)
                .append(previousLicense)
                .append(dateOfIssue)
                .append(dateOfExpiry)
                .append(properties)
                .append(files)
                .toHashCode();
    }
}