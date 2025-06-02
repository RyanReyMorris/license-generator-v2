package ru.ryanreymorris.license.generator.dto.response.license;

import com.fasterxml.jackson.annotation.JsonIgnore;
import ru.ryanreymorris.license.generator.entity.LicenseFile;
import ru.ryanreymorris.license.generator.enums.FileType;

import java.util.Arrays;
import java.util.Objects;
import java.util.UUID;

/**
 * Ответ с информацией о файле лицензии
 */
public class LicenseFileResponse {

    /**
     * ID
     */
    private UUID id;

    /**
     * Тип файла
     */
    private FileType fileType;

    /**
     * Имя
     */
    private String fileName;

    /**
     * Тип данных файла
     */
    private String dataType;

    /**
     * Сам файл
     */
    @JsonIgnore
    private byte[] data;

    public LicenseFileResponse() {
    }

    public LicenseFileResponse(String fileName, FileType fileType, String dataType, byte[] data) {
        this.fileName = fileName;
        this.fileType = fileType;
        this.dataType = dataType;
        this.data = data;
    }

    public LicenseFileResponse(LicenseFile licenseFile) {
        this.id = licenseFile.getId();
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

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public byte[] getData() {
        return data;
    }

    public void setData(byte[] data) {
        this.data = data;
    }

    public FileType getFileType() {
        return fileType;
    }

    public void setFileType(FileType fileType) {
        this.fileType = fileType;
    }

    public String getDataType() {
        return dataType;
    }

    public void setDataType(String dataType) {
        this.dataType = dataType;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        LicenseFileResponse that = (LicenseFileResponse) o;
        return Objects.equals(id, that.id) && fileType == that.fileType && Objects.equals(fileName, that.fileName) && Objects.equals(dataType, that.dataType) && Arrays.equals(data, that.data);
    }

    @Override
    public int hashCode() {
        int result = Objects.hash(id, fileType, fileName, dataType);
        result = 31 * result + Arrays.hashCode(data);
        return result;
    }

    @Override
    public String toString() {
        return "LicenseFileResponse{" +
                "id=" + id +
                ", fileType=" + fileType +
                ", fileName='" + fileName + '\'' +
                ", dataType='" + dataType + '\'' +
                ", data=" + Arrays.toString(data) +
                '}';
    }
}
