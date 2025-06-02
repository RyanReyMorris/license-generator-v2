/**
 * DTO для отправки запроса на логин
 *
 * @author DSalikhov
 * @export
 */
export class BaseAuth {
    /**
     *  Логин пользователя
     */
    username: string;
    /**
     * Пароль
     */
    password: string;

    constructor(username: string, password: string) {
        this.username = username;
        this.password = password;
    }
}
