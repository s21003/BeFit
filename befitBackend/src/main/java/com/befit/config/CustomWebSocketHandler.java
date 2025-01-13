//package com.befit.config;
//
//import org.springframework.messaging.handler.annotation.MessageMapping;
//import org.springframework.messaging.simp.annotation.SubscribeMapping;
//import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
//import org.springframework.messaging.simp.stomp.StompCommand;
//import org.springframework.web.socket.WebSocketSession;
//import org.springframework.web.socket.handler.TextWebSocketHandler;
//
//import java.security.Principal;
//
//public class CustomWebSocketHandler extends TextWebSocketHandler {
//
//    @Override
//    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
//        Principal principal = session.getPrincipal();
//        if (principal != null) {
//            System.out.println("User connected: " + principal.getName());
//        } else {
//            System.out.println("User connected with no principal");
//        }
//        super.afterConnectionEstablished(session);
//    }
//
//    @Override
//    public void handleTextMessage(WebSocketSession session, org.springframework.web.socket.TextMessage message) throws Exception {
//        Principal principal = session.getPrincipal();
//        if (principal != null) {
//            System.out.println("Received message from user: " + principal.getName());
//        }
//        System.out.println("Message: " + message.getPayload());
//
//        // You can send back a message to the client like this:
//        session.sendMessage(new org.springframework.web.socket.TextMessage("Message received"));
//    }
//
//    @Override
//    public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
//        System.out.println("Error on WebSocket connection: " + exception.getMessage());
//        super.handleTransportError(session, exception);
//    }
//
//    @Override
//    public void afterConnectionClosed(WebSocketSession session, org.springframework.web.socket.CloseStatus status) throws Exception {
//        System.out.println("User disconnected: " + (session.getPrincipal() != null ? session.getPrincipal().getName() : "No user"));
//        super.afterConnectionClosed(session, status);
//    }
//
//    // Example message mapping to handle specific topics/messages
//    @MessageMapping("/chat")
//    public void handleChatMessage(String message, Principal principal) {
//        // This will be invoked when a client sends a message to /app/chat
//        System.out.println("Chat message from user " + principal.getName() + ": " + message);
//
//        // You can send messages back to specific users like this:
//        // messagingTemplate.convertAndSendToUser(principal.getName(), "/queue/reply", "Received: " + message);
//    }
//
//    @SubscribeMapping("/topic/greetings")
//    public String sendGreeting() {
//        // Called when a user subscribes to /topic/greetings
//        return "Hello, welcome to WebSocket!";
//    }
//}
