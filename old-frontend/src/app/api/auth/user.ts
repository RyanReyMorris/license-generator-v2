import {Privileges} from './privileges';

/**
 * Пользователь
 *
 * @author DSalikhov
 * @export
 */
export class User {

    /**
     * ID
     */
    id: number;

    /**
     * Имя
     */
    username: string;

    /**
     * Пароль
     */
    password: string;

    /**
     * Массив доступных ролей
     */
    privileges: Array<Privileges>;

    /**
     * Указывает, включен или отключен пользователь
     */
    enabled: boolean;

    /**
     * Указывает, заблокирован пользователь или разблокирован
     */
    accountNonLocked: boolean;

    /**
     * Указывает, истек ли срок действия учетных данных (пароля) пользователя
     */
    credentialsNonExpired: boolean;

    /**
     * Указывает, истек ли срок действия учетной записи пользователя
     */
    accountNonExpired: boolean;
}
