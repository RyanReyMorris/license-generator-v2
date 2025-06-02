import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {User} from '@api/auth/user';

/**
 * Store для хранения текущего пользователя и состояния обновления
 */
@Injectable({
    providedIn: 'root'
})
export class AuthStore {
    private updating$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    private currentUser$: BehaviorSubject<User> = new BehaviorSubject<User>(null);

    isUpdating$(): Observable<boolean> {
        return this.updating$.asObservable();
    }

    setUpdating(isUpdating: boolean) {
        this.updating$.next(isUpdating);
    }

    getCurrentUser() {
        return this.currentUser$.asObservable();
    }

    setCurrentUser(user: User) {
        this.currentUser$.next(user);
    }
}

