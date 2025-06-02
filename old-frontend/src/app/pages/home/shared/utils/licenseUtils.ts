/**
 * Утилитный класс для различных операций с файлами лицензий
 */
export default class LicenseUtils {
    /**
     * Достает имя файла из запроса
     *
     * @param res - запрос
     */
    static getFileNameFromResponse(res): string {
        const contentDispostion = res.headers.get('content-disposition');
        const matches = /filename="([^;]+)"/gi.exec(contentDispostion);
        const filename = (matches[1] || 'untitled').trim();
        return filename;
    }
}
