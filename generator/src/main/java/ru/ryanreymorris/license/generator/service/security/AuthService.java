package ru.ryanreymorris.license.generator.service.security;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import ru.ryanreymorris.license.generator.dto.request.auth.LoginRequest;
import ru.ryanreymorris.license.generator.dto.request.auth.RegistrationRequest;
import ru.ryanreymorris.license.generator.dto.response.MessageResponse;
import ru.ryanreymorris.license.generator.dto.response.auth.PrincipalResponse;
import ru.ryanreymorris.license.generator.entity.Role;
import ru.ryanreymorris.license.generator.entity.User;
import ru.ryanreymorris.license.generator.enums.RoleNameImpl;
import ru.ryanreymorris.license.generator.exception.RegisterException;
import ru.ryanreymorris.license.generator.repository.RoleRepository;
import ru.ryanreymorris.license.generator.repository.UserRepository;

import javax.security.auth.login.LoginException;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

/**
 * Сервис авторизации
 */
@Service
public class AuthService {

    @Autowired
    private  UserRepository userRepository;
    @Autowired
    private  RoleRepository roleRepository;
    @Autowired
    private  PasswordEncoder encoder;

    /**
     * Логин
     *
     * @param loginRequest сущность с данными для логина
     * @return ответ
     */
    public MessageResponse authenticateUser(LoginRequest loginRequest, HttpServletRequest request) throws LoginException {
        Optional<User> user = userRepository.findByUsername(loginRequest.getUsername());
        if (user.isEmpty()) {
            throw new LoginException("Логин или пароль введены не правильно");
        } else if (!user.get().isAccountNonLocked()){
            throw new LoginException("Учетная запись заблокирована, обратитесь к администратору.");
        }
        try {
            request.login(loginRequest.getUsername(), loginRequest.getPassword());
        } catch (ServletException e) {
            return new MessageResponse("Ошибка авторизации.");
        }
        return new MessageResponse("Вход прошел успешно");
    }

    /**
     * Регистрация
     *
     * @param registrationRequest сущность с данными для регистации
     * @return ответ
     */
    public MessageResponse registerUser(RegistrationRequest registrationRequest) throws RegisterException {
        if (userRepository.findByUsername(registrationRequest.getUsername()).isPresent()) {
            throw new RegisterException("Имя уже занято");
        }
        User user = new User(
                registrationRequest.getUsername(),
                encoder.encode(registrationRequest.getPassword())
        );
        user.setAccountNonLocked(false);
        Set<Role> roles = new HashSet<>();
        Role userRole = roleRepository.findByName(RoleNameImpl.ROLE_USER)
                .orElseThrow(() -> new RuntimeException("Роль не найдена"));
        roles.add(userRole);
        user.setRoles(roles);
        userRepository.save(user);
        return new MessageResponse("Регистрация прошла успешно");
    }

    /**
     * Возвращает данные о текущем пользователи в контексте
     *
     * @return данные пользователя
     */
    public PrincipalResponse currentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ANONYMOUS"))) {
            return null;
        }
        return new PrincipalResponse(authentication);
    }
}
