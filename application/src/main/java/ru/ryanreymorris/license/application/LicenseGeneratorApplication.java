package ru.ryanreymorris.license.application;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.PropertySource;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = "ru.ryanreymorris.license")
@PropertySource({"classpath:application.properties"})
@EnableJpaRepositories("ru.ryanreymorris.license.*")
@ComponentScan(basePackages = { "ru.ryanreymorris.license.*" })
@EntityScan("ru.ryanreymorris.license.*")
public class LicenseGeneratorApplication {
    public static void main(String[] args) {
        SpringApplication.run(LicenseGeneratorApplication.class, args);
    }
}
