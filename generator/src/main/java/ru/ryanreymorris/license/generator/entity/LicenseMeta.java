package ru.ryanreymorris.license.generator.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ReflectionToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import ru.ryanreymorris.license.generator.dto.request.license.LicenseMetaRequest;
import ru.ryanreymorris.license.generator.dto.response.license.LicenseMetaResponse;
import ru.ryanreymorris.license.generator.entity.LicenseFile;
import ru.ryanreymorris.license.generator.entity.Property;
import ru.ryanreymorris.license.generator.enums.LicenseType;

import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Метаданные лицензии
 */
@Entity
@Table(name = "license_meta")
public class LicenseMeta {

    /**
     * Идентификатор
     */
    @Id
    private UUID id;

    /**
     * Тип лицензии
     */
    @Column(name = "license_type")
    @Enumerated(EnumType.STRING)
    @NotNull
    private LicenseType licenseType;

    /**
     * Предыдущий Идентификатор лицензии
     */
    @Column(name = "previous_license")
    private UUID previousLicense;

    /**
     * Дата выпуска(формат дат yyyy-MM-dd)
     */
    @Column(name = "date_of_issue")
    @NotNull
    private Date dateOfIssue;

    /**
     * Срок действия
     */
    @Column(name = "date_of_expiry")
    private Date dateOfExpiry;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JoinColumn(name = "license_meta_id")
    private List<ru.ryanreymorris.license.generator.entity.Property> properties;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JoinColumn(name = "license_meta_id")
    private List<LicenseFile> files;

    @Column(name = "user_id")
    private UUID userId;

    public LicenseMeta() {
    }

    public LicenseMeta(LicenseMeta licenseMeta) {
        this.id = null;
        this.licenseType = licenseMeta.getLicenseType();
        this.previousLicense = licenseMeta.getId();
        this.dateOfIssue = licenseMeta.getDateOfIssue();
        this.dateOfExpiry = licenseMeta.getDateOfExpiry();
        this.properties = licenseMeta.getProperties();
        this.files = licenseMeta.getFiles();
    }

    public LicenseMeta(LicenseMetaResponse LicenseMetaResponse) {
        this.id = LicenseMetaResponse.getId();
        this.licenseType = LicenseMetaResponse.getLicenseType();
        this.previousLicense = LicenseMetaResponse.getPreviousLicense();
        this.dateOfIssue = LicenseMetaResponse.getDateOfIssue();
        this.dateOfExpiry = LicenseMetaResponse.getDateOfExpiry();
        this.properties = LicenseMetaResponse.getProperties().entrySet().stream()
                .map(entry -> new ru.ryanreymorris.license.generator.entity.Property(entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());
    }

    public LicenseMeta(LicenseMetaRequest licenseMetaResponse) {
        this.dateOfExpiry = licenseMetaResponse.getDateOfExpiry();
        this.properties = licenseMetaResponse.getProperties().entrySet().stream()
                .map(entry -> new ru.ryanreymorris.license.generator.entity.Property(entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());
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

    public List<ru.ryanreymorris.license.generator.entity.Property> getProperties() {
        return properties;
    }

    public void setProperties(List<Property> properties) {
        this.properties = properties;
    }

    public List<LicenseFile> getFiles() {
        return files;
    }

    public void setFiles(List<LicenseFile> files) {
        this.files = files;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;

        if (o == null || getClass() != o.getClass()) return false;

        LicenseMeta licenseMeta = (LicenseMeta) o;

        return new EqualsBuilder()
                .append(id, licenseMeta.id)
                .append(licenseType, licenseMeta.licenseType)
                .append(previousLicense, licenseMeta.previousLicense)
                .append(dateOfIssue, licenseMeta.dateOfIssue)
                .append(dateOfExpiry, licenseMeta.dateOfExpiry)
                .append(properties, licenseMeta.properties)
                .append(files, licenseMeta.files)
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

    @Override
    public String toString() {
        return ReflectionToStringBuilder.toString(this, ToStringStyle.MULTI_LINE_STYLE,
                true, true);
    }
}
