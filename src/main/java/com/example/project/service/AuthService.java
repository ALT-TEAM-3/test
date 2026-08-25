package com.example.project.service;

import com.example.project.dto.*;
import com.example.project.entity.User;
import com.example.project.exception.CustomException;
import com.example.project.exception.ErrorCode;
import com.example.project.jwt.JwtTokenProvider;
import com.example.project.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    @Transactional
    public UserResponse signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.email())) throw new CustomException(ErrorCode.DUPLICATE_EMAIL);
        return UserResponse.from(userRepository.save(new User(request.email(), passwordEncoder.encode(request.password()))));
    }

    public TokenResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email()).orElseThrow(() -> new CustomException(ErrorCode.UNAUTHORIZED));
        if (!passwordEncoder.matches(request.password(), user.getPasswordHash()))
            throw new CustomException(ErrorCode.UNAUTHORIZED);
        return new TokenResponse(tokenProvider.createToken(user.getEmail()), "Bearer");
    }
}
