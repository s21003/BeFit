package com.befit.chat;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@Builder
public class Message {
    private String senderUsername;
    private String receiverUsername;
    private String content;
    private Date timestamp;
}

