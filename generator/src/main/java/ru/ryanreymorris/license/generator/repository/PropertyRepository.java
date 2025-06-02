package ru.ryanreymorris.license.generator.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import ru.ryanreymorris.license.generator.entity.Property;

import java.util.List;
import java.util.UUID;

public interface PropertyRepository extends JpaRepository<Property, UUID> {
    @Query(value = "SELECT p.value FROM public.license_property p WHERE p.key = 'issuedBy' GROUP BY p.value ORDER BY count(p.id) DESC", nativeQuery = true)
    List<String> getIssuersUsing();
}