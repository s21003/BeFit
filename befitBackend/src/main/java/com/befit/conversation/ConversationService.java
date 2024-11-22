package com.befit.conversation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ConversationService {
    @Autowired
    private ConversationRepository conversationRepository;
    public Optional<String> getConversationId(String senderEmail, String receiverEmail, boolean createIfNotExists){
        return conversationRepository.findBySenderEmailAndReceiverEmail(senderEmail, receiverEmail)
                .map(Conversation::getChatId)
                .or(() -> {
                    if (createIfNotExists){
                        var chatId = createChatId(senderEmail, receiverEmail);
                        return Optional.of(chatId);
                    }
                    return Optional.empty();
                });
    }

    private String createChatId(String senderEmail, String receiverEmail){
        var chatId = String.format("%s_%s", senderEmail, receiverEmail);

        Conversation senderReceiver = Conversation.builder()
                .chatId(chatId)
                .senderEmail(senderEmail)
                .receiverEmail(receiverEmail)
                .build();

        Conversation receiverSender = Conversation.builder()
                .chatId(chatId)
                .senderEmail(receiverEmail)
                .receiverEmail(senderEmail)
                .build();
        conversationRepository.save(senderReceiver);
        conversationRepository.save(receiverSender);
        return chatId;
    }
}
