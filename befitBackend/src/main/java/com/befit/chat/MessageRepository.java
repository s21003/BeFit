package com.befit.chat;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message,Long> {
    List<Message> findBySenderUsername(String senderUsername);

    List<Message> findByReceiverUsername(String receiverUsername);

    List<Message> findBySenderUsernameAndReceiverUsername(String senderUsername, String receiverUsername);

    List<Message> findBySenderUsernameOrReceiverUsername(String senderUsername, String receiverUsername);

    List<Message> findBySenderUsernameAndReceiverUsernameOrderByTimestampAsc(String username, String receiverUsername);

    @Query("SELECT m FROM Message m WHERE (m.senderUsername =:user1 AND m.receiverUsername =:user2) OR (m.senderUsername =:user2 AND m.receiverUsername =:user1) ORDER BY m.timestamp ASC")
    List<Message> findMessagesBetweenUsers(@Param("user1") String user1, @Param("user2") String user2);

}
