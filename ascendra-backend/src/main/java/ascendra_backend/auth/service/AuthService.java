package ascendra_backend.auth.service;

import ascendra_backend.auth.dto.AuthResponse;
import ascendra_backend.auth.dto.LoginRequest;
import ascendra_backend.auth.dto.RegisterRequest;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);
}