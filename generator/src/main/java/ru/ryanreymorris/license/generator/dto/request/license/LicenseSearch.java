package ru.ryanreymorris.license.generator.dto.request.license;

import ru.ryanreymorris.license.generator.enums.LicenseType;

public class LicenseSearch {

    private LicenseType licenseType;
    private Boolean real;
    private Boolean active;

    public LicenseType getLicenseType() {
        return licenseType;
    }

    public void setLicenseType(LicenseType licenseType) {
        this.licenseType = licenseType;
    }

    public Boolean getReal() {
        return real;
    }

    public void setReal(Boolean real) {
        this.real = real;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }
}
