export enum LicenseType {
    SYSTEM = "SYSTEM",
    PLATFORM = "PLATFORM",
    KEDO = "KEDO",
    SED = "SED"
}

/**
 * Токен для определения типа файла
 */
export enum FileType {
  /**
   * Файл с лицензией
   */
  LICENSE_FILE="LICENSE_FILE",
  /**
   * Файл с открытым ключом
   */
  PUBLIC_KEY="PUBLIC_KEY",
  /**
   * Любые другие файлы
   */
  OTHER="OTHER"
}
