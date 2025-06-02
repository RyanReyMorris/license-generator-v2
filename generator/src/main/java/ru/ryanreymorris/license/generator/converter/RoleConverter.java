package ru.ryanreymorris.license.generator.converter;


import jakarta.persistence.AttributeConverter;
import ru.ryanreymorris.license.generator.enums.RoleNameImpl;

/**
 * Конвертор для внесения/вынесения ролей из БД
 */
public class RoleConverter implements AttributeConverter<RoleNameImpl, String> {

    /**
     * Достает название роли
     *
     * @param attribute Роль
     * @return Строка
     */
    @Override
    public String convertToDatabaseColumn(RoleNameImpl attribute) {
        return attribute.getAuthority();
    }

    /**
     * @param dbData Роль в ввиде строки
     * @return Роль из множесва
     */
    @Override
    public RoleNameImpl convertToEntityAttribute(String dbData) {
        return RoleNameImpl.valueOf(dbData);
    }
}
