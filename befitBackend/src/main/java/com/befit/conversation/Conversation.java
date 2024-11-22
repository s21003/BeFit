package com.befit.conversation;

import com.befit.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Data
@Table (name = "Conversation")
@Entity
@Builder
public class Conversation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @JoinColumn
    private String chatId;

    @JoinColumn
    private String senderEmail;

    @JoinColumn
    private String receiverEmail;

}