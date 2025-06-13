package dev.harshbhargav.backend.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService userDetailsService;

    public AuthResponse register(RegisterRequest request) {
        // Check if username or email already exists
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        // Create new user
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole() != null && request.getRole().equals("ADMIN") ? "ADMIN" : "USER");

        userRepository.save(user);

        // Generate token
        String token = jwtUtil.generateToken(user);
        // Return response
        System.out.println("User registered successfully");
        System.out.println("Token: " + token);
        System.out.println("Username: " + user.getUsername());
        System.out.println("Role: " + user.getRole());
        System.out.println("User ID: " + user.getId());
        System.out.println("User Email: " + user.getEmail());
        System.out.println("User Password: " + user.getPassword());
        System.out.println("User Enabled: " + user.isEnabled());
        return new AuthResponse(token, user.getUsername(), user.getRole());
    }

    public AuthResponse login(LoginRequest request) {
        // Authenticate
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        // Get user
        User user = (User) userDetailsService.loadUserByUsername(request.getUsername());

        // Generate token
        String token = jwtUtil.generateToken(user);
        System.out.println("User logged in successfully");
        System.out.println("Token: " + token);
        System.out.println("Username: " + user.getUsername());
        System.out.println("Role: " + user.getRole());
        System.out.println("User ID: " + user.getId());
        System.out.println("User Email: " + user.getEmail());
        System.out.println("User Password: " + user.getPassword());
        System.out.println("User Enabled: " + user.isEnabled());
        // Return response
        return new AuthResponse(token, user.getUsername(), user.getRole());
    }
}