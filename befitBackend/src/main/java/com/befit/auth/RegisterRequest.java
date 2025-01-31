package com.befit.auth;

import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class RegisterRequest {
    private String name;
    private String surname;
    private String address;
    private String username;
    private String password;
    private String role;
}
