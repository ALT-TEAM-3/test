package com.example.project.service;
import com.example.project.dto.UserResponse;
import com.example.project.dto.UserUpdateRequest;
import com.example.project.entity.User;
import com.example.project.exception.CustomException;
import com.example.project.exception.ErrorCode;
import com.example.project.repository.UserRepository;
import com.example.project.repository.PostRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class UserService {
    private final UserRepository userRepository; private final PostRepository postRepository; private final PasswordEncoder passwordEncoder;
    public UserService(UserRepository userRepository, PostRepository postRepository, PasswordEncoder passwordEncoder) { this.userRepository = userRepository; this.postRepository = postRepository; this.passwordEncoder = passwordEncoder; }
    public UserResponse getMe(String email) { return UserResponse.from(findByEmail(email)); }
    public UserResponse getById(Long id) { return UserResponse.from(userRepository.findById(id).orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND))); }
    @Transactional public UserResponse updatePassword(String email, UserUpdateRequest request) { User user = findByEmail(email); user.changePassword(passwordEncoder.encode(request.password())); return UserResponse.from(user); }
    @Transactional public void deleteMe(String email) { User user = findByEmail(email); postRepository.deleteByUserId(user.getId()); userRepository.delete(user); }
    private User findByEmail(String email) { return userRepository.findByEmail(email).orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND)); }
}
