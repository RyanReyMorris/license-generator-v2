package ru.ryanreymorris.license.generator.controllers.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.ryanreymorris.license.generator.dto.request.auth.LoginRequest;
import ru.ryanreymorris.license.generator.dto.request.auth.RegistrationRequest;
import ru.ryanreymorris.license.generator.dto.response.MessageResponse;
import ru.ryanreymorris.license.generator.dto.response.auth.PrincipalResponse;
import ru.ryanreymorris.license.generator.exception.RegisterException;
import ru.ryanreymorris.license.generator.service.security.AuthService;

import javax.security.auth.login.LoginException;


/**
 * Котроллер безопасноси
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    /**
     * Логин
     *
     * @param loginRequest сущность с данными для логина
     * @return ответ
     */
    @PostMapping("/login")
    public ResponseEntity<MessageResponse> authenticateUser(HttpServletRequest request, @Valid @RequestBody LoginRequest loginRequest) throws LoginException {
        return ResponseEntity.ok(authService.authenticateUser(loginRequest, request));
    }

    /**
     * Регистация
     *
     * @param registrationRequest сущность с данными для регистации
     * @return ответ
     */
    @PostMapping("/registration")
    public ResponseEntity<MessageResponse> registerUser(@Valid @RequestBody RegistrationRequest registrationRequest) throws RegisterException {
        return ResponseEntity.ok(authService.registerUser(registrationRequest));
    }

    /**
     * Возвращает данные о текущем пользователи в контексте
     *
     * @return данные пользователя
     */
    @GetMapping("/currentUser")
    public ResponseEntity<PrincipalResponse> currentUser() {
        return ResponseEntity.ok(authService.currentUser());
    }
}
