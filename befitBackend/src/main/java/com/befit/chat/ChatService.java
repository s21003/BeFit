package com.befit.chat;

import com.befit.conversation.ConversationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ChatService {
    @Autowired
    private MessageRepository messageRepository;
    @Autowired
    private ConversationService conversationService;

    public List<Message> allMessages(){
        return  messageRepository.findAll();
    }
    public Message createMessage(Message m){
        String chatId = conversationService.getConversationId(m.getSenderEmail(),m.getReceiverEmail(),true).orElseThrow();
        m.setChatId(chatId);
        messageRepository.save(m);
        return m;
    }

    public List<Message> findMessages(String senderEmail, String receiverEmail){
        var chatId = conversationService.getConversationId(senderEmail,receiverEmail,false);
        return chatId.map(messageRepository::findByChatId).orElse(new ArrayList<>());
    }

    public String dropMessage(Long id){
        if(messageRepository.findById(id).isEmpty()){
            return "WrongId";
        }
        messageRepository.deleteById(id);
        return "Deleted";
    }
    public String editMessage(Message m, Long id){
        Optional<Message> tmp = singleMessage(id);
        if (tmp.isEmpty()){
            return "WrongId";
        }else{
            messageRepository.save(m);
            return "Updated";
        }
    }
    public Optional<Message> singleMessage(Long id){
        return messageRepository.findById(id);
    }


}
