package com.befit.chat;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Data
@Table (name = "Message")
@Entity
@Builder
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column
    private String chatId;

    @Column
    private String senderEmail;

    @Column
    private String receiverEmail;

    @Column
    private String text;

    @Column
    private Date timestamp;
}
