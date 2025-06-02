package ru.ryanreymorris.license.generator.dto.request.license;

import jakarta.validation.constraints.NotNull;
import java.util.Date;
import java.util.UUID;

/**
 * Запрос на обновление лицензии
 */
public class LicenseUpdateRequest {

    /**
     * ID лицензии
     */
    @NotNull
    private UUID id;

    /**
     * Новая дата окончания
     */
    @NotNull
    private Date dateOfExpiry;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Date getDateOfExpiry() {
        return dateOfExpiry;
    }

    public void setDateOfExpiry(Date dateOfExpiry) {
        this.dateOfExpiry = dateOfExpiry;
    }
}
