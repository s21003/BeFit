package com.befit.auth;

import com.befit.config.JwtService;
import com.befit.goal.Goal;
import com.befit.goal.GoalRepository; // Add GoalRepository
import com.befit.trainer.Trainer;
import com.befit.trainer.TrainerRepository;
import com.befit.user.Role;
import com.befit.user.User;
import com.befit.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository repository;
    private final TrainerRepository trainerRepository;
    private final GoalRepository goalRepository; // Add this dependency
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse register(RegisterRequest request) {

        // Check if the username already exists
        if (repository.findByUsername(request.getUsername()).isPresent()) {
            return AuthenticationResponse.builder()
                    .token("UsernameTaken")
                    .build();
        }

        // Validate the role from the request
        Role role;
        try {
            role = Role.valueOf(request.getRole().toUpperCase()); // Convert input to uppercase and map to Role enum
        } catch (IllegalArgumentException e) {
            return AuthenticationResponse.builder()
                    .token("InvalidRole")
                    .build();
        }

        // Create and save the user
        var user = new User(
                request.getName(),
                request.getSurname(),
                request.getAddress(),
                request.getUsername(),
                passwordEncoder.encode(request.getPassword()),
                role
        );
        repository.save(user);

        // If the user is a trainer, create a trainer entry
        if (role == Role.TRAINER) {
            Trainer trainer = new Trainer();
            trainer.setUser(user);
            trainerRepository.save(trainer);
        }

        // Create a default goal for the new user
        Goal goal = new Goal();
        goal.setUserUsername(user.getUsername()); // Associate the goal with the user
        goalRepository.save(goal); // Save the goal

        var jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );
        var user = repository.findByUsername(request.getUsername()).orElseThrow();
        var jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }
}
