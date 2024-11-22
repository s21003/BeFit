package com.befit.user;

import com.befit.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    public List<User> allUsers(){
        return userRepository.findAll();
    }

    public String register(Map<String, String> payload) {
        Optional<User> optionalUser = userRepository.findByEmail(payload.get("email"));

        if(optionalUser.isPresent()) {
            return "Email exists";
        }

        User user = new User(payload.get("name"),payload.get("surname"),payload.get("address"),payload.get("password"),payload.get("email"), Role.USER);
        userRepository.save(user);

        return "User added";
    }

    private static long parseId(String id) {
        try{
            return Long.parseLong(id);
        }catch (NumberFormatException e) {
            return -1;
        }

    }

    public User createUser(User u){
        User user = new User();
        user.setName(u.getName());
        user.setSurname(u.getSurname());
        user.setAddress(u.getAddress());
        user.setPassword(u.getPassword());
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
    public String editUSer(User u){
        Optional<User> tmp = singleUser(u.getId());
        if (tmp.isEmpty()){
            return "WrongId";
        }else{
            User user = tmp.get();
            if (!Objects.equals(user.getName(), u.getName())){
                user.setName(u.getName());
            }
            if (!Objects.equals(user.getSurname(), u.getSurname())){
                user.setSurname(u.getSurname());
            }
            if (!Objects.equals(user.getAddress(), u.getAddress())){
                user.setAddress(u.getAddress());
            }
            if (user.getPassword() != u.getPassword()){
                user.setPassword(u.getPassword());
            }
            userRepository.save(user);
            return "Updated";
        }
    }
    public Optional<User> singleUser(Long id){
        return userRepository.findById(id);
    }
    public Optional<User> singleUserByEmail(String email){
        return userRepository.findByEmail(email);
    }

}
