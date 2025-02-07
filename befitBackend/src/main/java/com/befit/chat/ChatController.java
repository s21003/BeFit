package com.befit.chat;

import com.befit.config.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.concurrent.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;

@Controller
@CrossOrigin("http://localhost:3000")
@RequestMapping("/chat")
public class ChatController {

    private final Map<String, SseEmitter> emitters = new ConcurrentHashMap<>();
    private final ScheduledExecutorService executor = Executors.newScheduledThreadPool(10);

    @Autowired
    private MessageService messageService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserDetailsService userDetailsService;

    @GetMapping(value = "/chat-updates", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamUpdates(@RequestParam("token") String token) {
        String username = jwtService.extractUsername(token);
        if (username == null) {
            return createErrorEmitter("Invalid token");
        }
        UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);
        if (!jwtService.isTokenValid(token, userDetails)) {
            return createErrorEmitter("Invalid token");
        }

        SseEmitter emitter = new SseEmitter(30 * 60 * 1000L);

        SseEmitter existingEmitter = emitters.get(username);
        if (existingEmitter != null) {
            existingEmitter.complete();
        }
        emitters.put(username, emitter);

        System.out.println("Connection opened for user: " + username);

        try {
            emitter.send(SseEmitter.event().data(Collections.emptyMap()).comment("Connection established"));
        } catch (IOException e) {
            System.out.println("Error: " + e);
        }

        ScheduledFuture<?> keepAliveTask = executor.scheduleAtFixedRate(() -> {
            try {
                emitter.send(SseEmitter.event().comment("keep-alive"));
            } catch (IOException e) {
                System.out.println("Error sending keep-alive message: " + e.getMessage());
                handleEmitterError(username, emitter, e);
            }
        }, 0, 60, TimeUnit.SECONDS);

        emitter.onCompletion(() -> {
            removeEmitter(username);
            keepAliveTask.cancel(true);
            System.out.println("Connection closed for user: " + username);
        });
        emitter.onError((e) -> {
            removeEmitter(username);
            keepAliveTask.cancel(true);
            System.out.println("Connection closed for user: " + username);
        });
        emitter.onTimeout(() -> {
            removeEmitter(username);
            keepAliveTask.cancel(true);
            System.out.println("Connection closed for user: " + username);
        });

        return emitter;
    }

    private SseEmitter createErrorEmitter(String errorMessage) {
        SseEmitter emitter = new SseEmitter();
        emitter.completeWithError(new Throwable(errorMessage));
        return emitter;
    }

    private void handleEmitterError(String username, SseEmitter emitter, IOException e) {
        System.err.println("Error sending keep-alive message to " + username + ": " + e.getMessage());
        removeEmitter(username);
        emitter.completeWithError(e);
    }

    private void removeEmitter(String username) {
        emitters.remove(username);
    }

    @PostMapping("/send-message")
    public ResponseEntity<Object> sendMessage(@RequestBody Message message, @RequestHeader("Authorization") String token) {
        String username = jwtService.extractUsername(token.substring(7));
        if (username == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid token");
        }
        message.setSenderUsername(username);
        message.setTimestamp(LocalDateTime.now());

        Message savedMessage = messageService.saveMessage(message);

        String receiverUsername = savedMessage.getReceiverUsername();
        SseEmitter receiverEmitter = emitters.get(receiverUsername);
        if (receiverEmitter != null) {
            try {
                receiverEmitter.send(savedMessage);
            } catch (IOException e) {
                System.err.println("Error sending message via SSE to " + receiverUsername + ": " + e.getMessage());
                removeEmitter(receiverUsername);
            }
        }

        return ResponseEntity.ok(savedMessage);
    }

    @GetMapping("/chat-history/{receiverUsername}")
    public ResponseEntity<List<Message>> getChatHistory(@PathVariable String receiverUsername, @RequestHeader("Authorization") String token) {
        String username = jwtService.extractUsername(token.substring(7));

        if (username == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body((List<Message>) Collections.singletonMap("error", "Invalid token"));
        }

        List<Message> messages = messageService.getMessagesBetweenUsers(username, receiverUsername);

        return ResponseEntity.ok()
                .header("Content-Type", "application/json")
                .body(messages);
    }
}
