package com.befit.chat;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    public Message saveMessage(Message message) {
        return messageRepository.save(message);
    }

    public List<Message> getMessagesByUsername(String username) {
        return messageRepository.findBySenderUsernameOrReceiverUsername(username, username);
    }

    public List<Message> getMessagesBetweenUsers(String user1, String user2) {
        return messageRepository.findMessagesBetweenUsers(user1, user2);
    }

}