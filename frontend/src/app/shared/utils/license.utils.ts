/**
 * Утилитный класс для различных операций с файлами лицензий
 */
export class LicenseUtils {
  /**
   * Достает имя файла из запроса
   *
   * @param res - запрос
   */
  static getFileNameFromResponse(res: any): string {
    const contentDispostion = res.headers.get('content-disposition');
    const match = /filename="([^;]+)"/gi.exec(contentDispostion)![1];
    return (match || 'untitled').trim();
  }
}
