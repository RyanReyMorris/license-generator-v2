package ru.ryanreymorris.license.generator.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ReflectionToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import org.hibernate.annotations.GenericGenerator;
import ru.ryanreymorris.license.generator.entity.LicenseMeta;

import java.util.UUID;

/**
 * Класс для хранения разных пропертей лицензии
 */
@Entity
@Table(name = "license_property")
public class Property {

    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    private UUID id;

    /**
     * Ключ
     */
    @JoinColumn(name="key")
    private String key;

    @ManyToOne
    @JoinColumn(name="license_meta_id")
    private LicenseMeta licenseMeta;

    /**
     * Значение
     */
    @Column(columnDefinition="TEXT")
    private String value;

    public Property() {
    }

    public Property(String key, String value) {
        this.key = key;
        this.value = value;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public LicenseMeta getLicenseMeta() {
        return licenseMeta;
    }

    public void setLicenseMeta(LicenseMeta licenseMeta) {
        this.licenseMeta = licenseMeta;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;

        if (o == null || getClass() != o.getClass()) return false;

        Property that = (Property) o;

        return new EqualsBuilder()
                .append(id, that.id)
                .append(key, that.key)
                .append(value, that.value)
                .isEquals();
    }

    @Override
    public int hashCode() {
        return new HashCodeBuilder(17, 37)
                .append(id)
                .append(key)
                .append(value)
                .toHashCode();
    }

    @Override
    public String toString() {
        return ReflectionToStringBuilder.toString(this, ToStringStyle.MULTI_LINE_STYLE,
                true, true);
    }
}
