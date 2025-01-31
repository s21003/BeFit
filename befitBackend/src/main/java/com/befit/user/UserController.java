package com.befit.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin("http://localhost:3000")
@RequestMapping("/user")
public class UserController {
    @Autowired
    private UserService userService;
    @GetMapping("/all")
    public ResponseEntity<List<User>> getAllUsers(){
        return new ResponseEntity<>(userService.allUsers(), HttpStatus.OK);
    }
    @PostMapping("/add")
    public ResponseEntity<User> addNewUser(@RequestBody User u){
        return new ResponseEntity<>(userService.createUser(u),HttpStatus.CREATED);
    }
    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteUser(@RequestBody User u){
        return new ResponseEntity<>(userService.dropUser(u.getId()),HttpStatus.OK);
    }
    @PutMapping("/update")
    public ResponseEntity<User> updateUser(@RequestBody UserDTO u){
        User updatedUser = userService.editUser(u);
        return new ResponseEntity<>(updatedUser,HttpStatus.OK);
    }

    @PutMapping("/updateUser")
    public ResponseEntity<User> updateUserData(@RequestBody UserDataDTO u){
        User updatedUser = userService.editUserData(u);
        return new ResponseEntity<>(updatedUser,HttpStatus.OK);
    }

    @GetMapping("/{username}")
    public ResponseEntity<Optional<User>> getSingleUser(@PathVariable String username){
        return new ResponseEntity<>(userService.singleUserByUsername(username),HttpStatus.OK);
    }
    @GetMapping("/user/{id}")
    public ResponseEntity<Optional<User>> getSingleUser(@PathVariable Long id){
        return new ResponseEntity<>(userService.singleUserById(id),HttpStatus.OK);
    }
}
