package ru.ryanreymorris.license.generator.dto.response.license;

import ru.ryanreymorris.license.generator.dto.response.license.LicenseStatus;

import java.util.Map;

/**
 * Ответ о проверке лицензии
 */
public class DecryptAndCheckResponse {

    /**
     * Информация о проверки
     */
    ru.ryanreymorris.license.generator.dto.response.license.LicenseStatus licenseStatus;

    /**
     * Расшифрованная лицензия
     */
    Map<String, String> decryptedLicense;

    public DecryptAndCheckResponse() {
    }

    public ru.ryanreymorris.license.generator.dto.response.license.LicenseStatus getLicenseStatus() {
        return licenseStatus;
    }

    public void setLicenseStatus(LicenseStatus licenseStatus) {
        this.licenseStatus = licenseStatus;
    }

    public Map<String, String> getDecryptedLicense() {
        return decryptedLicense;
    }

    public void setDecryptedLicense(Map<String, String> decryptedLicense) {
        this.decryptedLicense = decryptedLicense;
    }
}
