package ru.ryanreymorris.license.generator.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import ru.ryanreymorris.license.generator.enums.LicenseType;
import ru.ryanreymorris.license.generator.interfaces.LicenseGenerator;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Конфигурация контекста Spring
 */
@Configuration
public class AppConfig {


    @Autowired
    private List<LicenseGenerator> licenseGenerators;

    @Bean
    public Map<LicenseType, LicenseGenerator> buttons() {
        Map<LicenseType, LicenseGenerator> licenseGeneratorsMap = new HashMap<>();
        for (LicenseGenerator licenseGenerator : licenseGenerators) {
            licenseGeneratorsMap.put(licenseGenerator.getLicenseType(), licenseGenerator);
        }
        return licenseGeneratorsMap;
    }
}
