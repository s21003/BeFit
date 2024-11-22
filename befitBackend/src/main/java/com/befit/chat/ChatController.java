package com.befit.chat;

import com.befit.mealSchema.MealSchema;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin("http://localhost:3000")
@RequestMapping("/chat")
public class ChatController {
    @Autowired
    private ChatService chatService;
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @GetMapping("/all")
    public ResponseEntity<List<Message>> getAllMessages(){
        return new ResponseEntity<>(chatService.allMessages(), HttpStatus.OK);
    }

    @PostMapping("/add")
    public ResponseEntity<Message> addNewMessage(@RequestBody Message ms){
        return new ResponseEntity<>(chatService.createMessage(ms),HttpStatus.CREATED);
    }
    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteMessage(@RequestBody Message ms){
        return new ResponseEntity<>(chatService.dropMessage(ms.getId()),HttpStatus.OK);
    }
    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateMessage(@RequestBody Message ms, @PathVariable Long id){
        return new ResponseEntity<>(chatService.editMessage(ms,id),HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<Message>> getSingleExercise(@PathVariable Long id){
        return new ResponseEntity<>(chatService.singleMessage(id),HttpStatus.OK);
    }

    @GetMapping("/{senderEmail}/{receiverEmail}")
    public ResponseEntity<List<Message>> findChatMessage(@PathVariable("senderEmail") String senderEmail, @PathVariable("receiverEmail") String receiverEmail) {
        return ResponseEntity.ok(chatService.findMessages(senderEmail, receiverEmail));
    }

    @MessageMapping("/")
    public void processMessage(@Payload Message message){
        Message savedMessage = chatService.createMessage(message);
        messagingTemplate.convertAndSendToUser(message.getReceiverEmail(), "/queue/messages",
                ChatNotification.builder()
                        .id(savedMessage.getId())
                        .senderEmail(savedMessage.getSenderEmail())
                        .receiverEmail(savedMessage.getReceiverEmail())
                        .text(savedMessage.getText())
                        .build()
                );
    }
}
