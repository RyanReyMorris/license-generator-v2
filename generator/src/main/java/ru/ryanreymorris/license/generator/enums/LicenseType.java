package ru.ryanreymorris.license.generator.enums;

/**
 * Типы доступных лицензий
 */
public enum LicenseType {
    SYSTEM("SYSTEM");

    private final String licenseType;

    LicenseType(String licenseType) {
        this.licenseType = licenseType;
    }

    public String getLicenseType() {
        return this.licenseType;
    }

    public static class Constants {
        public static final String SYSTEM = "SYSTEM";
    }
}
