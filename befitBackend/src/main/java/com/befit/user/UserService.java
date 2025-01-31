package com.befit.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;  // Injecting PasswordEncoder

    public List<User> allUsers(){
        return userRepository.findAll();
    }

    public User createUser(User u){
        User user = new User();
        user.setName(u.getName());
        user.setSurname(u.getSurname());
        user.setAddress(u.getAddress());
        user.setPassword(passwordEncoder.encode(u.getPassword()));  // Encode the password
        user.setRole(Role.USER);
        userRepository.save(user);
        return user;
    }
    public String dropUser(Long id){
        if (userRepository.findById(id).isEmpty()){
            return "WrongId";
        }
        userRepository.deleteById(id);
        return "Deleted";
    }
    public User editUser(UserDTO u) {
        Optional<User> existingUser = getOptionalUser();
        if (!existingUser.isPresent()) {
            throw new IllegalArgumentException("User with the given ID does not exist");
        }
        User updatedUser = existingUser.get();
        if (u.getUsername() != null) {
            if (userRepository.findByUsername(u.getUsername()).isEmpty()) {
                updatedUser.setUsername(u.getUsername());
            } else {
                throw new IllegalArgumentException("Username is taken");
            }
        }
        if (u.getPassword() != null && !u.getPassword().isEmpty()) {
            updatedUser.setPassword(passwordEncoder.encode(u.getPassword()));
        }

        return userRepository.save(updatedUser);
    }

    public Optional<User> singleUser(Long id){
        return userRepository.findById(id);
    }
    public Optional<User> singleUserByUsername(String username){

        return userRepository.findByUsername(username);
    }

    private Optional<User> getOptionalUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        System.out.println("username in optional: "+username);
        return userRepository.findByUsername(username);
    }

    public Optional<User> singleUserById(Long id) {
        return userRepository.findById(id);
    }

    public User editUserData(UserDataDTO u) {
        Optional<User> existingUser = getOptionalUser();
        if (!existingUser.isPresent()) {
            throw new IllegalArgumentException("User with the given ID does not exist");
        }
        User updatedUser = existingUser.get();

        updatedUser.setName(u.getName());
        updatedUser.setSurname(u.getSurname());
        updatedUser.setAddress(u.getAddress());

        return userRepository.save(updatedUser);
    }
}
