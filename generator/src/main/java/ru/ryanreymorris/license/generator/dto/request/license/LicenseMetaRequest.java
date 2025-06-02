package ru.ryanreymorris.license.generator.dto.request.license;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;

import java.util.Date;
import java.util.Map;

/**
 * Запрос на получение мета-информации лицензии
 */
public class LicenseMetaRequest {

    /**
     * Срок действия
     */
    private Date dateOfExpiry;

    /**
     * Дополнительны параметры
     */
    @JsonProperty("properties")
    private Map<String, String> properties;

    public LicenseMetaRequest() {
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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        LicenseMetaRequest that = (LicenseMetaRequest) o;
        return new EqualsBuilder()
                .append(dateOfExpiry, that.dateOfExpiry)
                .append(properties, that.properties)
                .isEquals();
    }

    @Override
    public int hashCode() {
        return new HashCodeBuilder(17, 37)
                .append(dateOfExpiry)
                .append(properties)
                .toHashCode();
    }
}