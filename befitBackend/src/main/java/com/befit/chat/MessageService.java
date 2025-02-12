package com.befit.chat;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionTemplate;

import java.util.List;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private PlatformTransactionManager transactionManager;

    public Message saveMessage(Message message) {
        TransactionTemplate transactionTemplate = new TransactionTemplate(transactionManager);
        return transactionTemplate.execute(status -> {
            return messageRepository.save(message);
        });
    }

    @Transactional
    public List<Message> getMessagesByUsername(String username) {
        return messageRepository.findBySenderUsernameOrReceiverUsername(username, username);
    }

    @Transactional
    public List<Message> getMessagesBetweenUsers(String user1, String user2) {
        return messageRepository.findMessagesBetweenUsers(user1, user2);
    }

}