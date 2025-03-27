package dev.harshbhargav.backend.config;

import dev.harshbhargav.backend.auth.User;
import dev.harshbhargav.backend.auth.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AdminInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Check if admin already exists
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@example.com");
            admin.setPassword(passwordEncoder.encode("admin123")); // Change this in production
            admin.setRole("ADMIN");
            admin.setEnabled(true);

            userRepository.save(admin);
            System.out.println("Admin user created successfully");
        }
    }
}