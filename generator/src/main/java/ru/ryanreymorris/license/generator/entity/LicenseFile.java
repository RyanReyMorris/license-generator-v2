package ru.ryanreymorris.license.generator.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import org.antlr.v4.runtime.misc.NotNull;
import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ReflectionToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import org.hibernate.annotations.GenericGenerator;
import ru.ryanreymorris.license.generator.dto.response.license.LicenseFileResponse;
import ru.ryanreymorris.license.generator.enums.FileType;

import java.util.UUID;

/**
 * Файловое представление ключа
 */
@Entity
@Table(name = "license_file")
public class LicenseFile {

    /**
     * ID
     */
    @Id
    @NotNull
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    private UUID id;

    @Column(name = "file_type")
    @Enumerated(EnumType.STRING)
    @NotNull
    private FileType fileType;

    /**
     * Имя
     */
    @Column(name = "file_name")
    @NotNull
    private String fileName;

    /**
     * Тип файла
     */
    @Column(name = "data_type")
    @NotNull
    private String dataType;

    /**
     * Сам файл
     */
    @Lob
    @NotNull
    private byte[] data;

    public LicenseFile() {
    }

    public LicenseFile(String fileName, FileType fileType, String dataType, byte[] data) {
        this.fileName = fileName;
        this.fileType = fileType;
        this.dataType = dataType;
        this.data = data;
    }

    public LicenseFile(LicenseFileResponse licenseFileDTO) {
        this.id = licenseFileDTO.getId();
        this.fileType = licenseFileDTO.getFileType();
        this.fileName = licenseFileDTO.getFileName();
        this.dataType = licenseFileDTO.getDataType();
    }

    public LicenseFile(LicenseFile licenseFile) {
        this.fileType = licenseFile.getFileType();
        this.fileName = licenseFile.getFileName();
        this.dataType = licenseFile.getDataType();
        this.data = licenseFile.getData();
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public FileType getFileType() {
        return fileType;
    }

    public void setFileType(FileType fileType) {
        this.fileType = fileType;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getDataType() {
        return dataType;
    }

    public void setDataType(String fileType) {
        this.dataType = fileType;
    }

    public byte[] getData() {
        return data;
    }

    public void setData(byte[] data) {
        this.data = data;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;

        if (o == null || getClass() != o.getClass()) return false;

        LicenseFile licenseFile = (LicenseFile) o;

        return new EqualsBuilder()
                .append(id, licenseFile.id)
                .append(fileType, licenseFile.fileType)
                .append(fileName, licenseFile.fileName)
                .append(dataType, licenseFile.dataType)
                .append(data, licenseFile.data)
                .isEquals();
    }

    @Override
    public int hashCode() {
        return new HashCodeBuilder(17, 37)
                .append(id)
                .append(fileType)
                .append(fileName)
                .append(dataType)
                .append(data)
                .toHashCode();
    }

    @Override
    public String toString() {
        return ReflectionToStringBuilder.toString(this, ToStringStyle.MULTI_LINE_STYLE,
                true, true);
    }
}
