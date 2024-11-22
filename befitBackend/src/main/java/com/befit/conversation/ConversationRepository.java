package com.befit.conversation;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ConversationRepository extends JpaRepository<Conversation, Long> {
    Optional<Conversation> findBySenderEmailAndReceiverEmail(String senderEmail, String receiverEmail);
}
