//package com.befit.config;
//
//import org.springframework.http.HttpStatus;
//import org.springframework.http.server.ServerHttpRequest;
//import org.springframework.http.server.ServerHttpResponse;
//import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.stereotype.Component;
//import org.springframework.web.socket.WebSocketHandler;
//import org.springframework.web.socket.server.HandshakeInterceptor;
//
//import java.util.Date;
//import java.util.Map;
//
//@Component
//public class JwtHandshakeInterceptor implements HandshakeInterceptor {
//
//    private final JwtService jwtService;
//    private final UserDetailsService userDetailsService;
//
//    public JwtHandshakeInterceptor(JwtService jwtService, UserDetailsService userDetailsService) {
//        //System.out.println("JwtHandshakeInterceptor instantiated");
//        this.jwtService = jwtService;
//        this.userDetailsService = userDetailsService;
//    }
//
//    @Override
//    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler, Map<String, Object> attributes) throws Exception {
//        System.out.println("Attempting WebSocket handshake...");
//        System.out.println("Request Headers: " + request.getHeaders());
//
//        // Extract the JWT token from the "Authorization" header
//        String authHeader = request.getHeaders().getFirst("Authorization");
//        System.out.println("Authorization header received: " + authHeader); // Log the Authorization header
//
//        if (authHeader != null && authHeader.startsWith("Bearer ")) {
//            String token = authHeader.substring(7); // Extract the token
//            System.out.println("Extracted token: " + token); // Log the token
//
//            // Validate token and get username
//            String username = jwtService.extractUsername(token);
//            if (username != null) {
//                System.out.println("Extracted username: " + username); // Log the extracted username
//
//                // Load user details
//                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
//                System.out.println("Loaded user details for: " + username);
//
//                // Log the expiration time of the token for debugging
//                Date expirationDate = jwtService.extractExpirationDate(token);
//                System.out.println("Token expiration date: " + expirationDate);
//
//                // Validate token
//                if (jwtService.isTokenValid(token, userDetails)) {
//                    System.out.println("Token is valid for user: " + username);
//
//                    // Create SimpMessageHeaderAccessor and set the user for WebSocket session
//                    SimpMessageHeaderAccessor headerAccessor = SimpMessageHeaderAccessor.create();
//                    headerAccessor.setUser(() -> username); // Set the user in the WebSocket session
//
//                    // Add user and token information to the attributes
//                    attributes.put("username", username);  // Store username in the WebSocket session attributes
//                    return true;  // Allow the handshake to proceed
//                } else {
//                    System.out.println("Invalid token for user: " + username);
//                    response.setStatusCode(HttpStatus.FORBIDDEN);  // Token invalid, respond with 403
//                    return false;  // Reject the handshake
//                }
//            }
//        }
//
//        // If no token or invalid token
//        System.out.println("Authorization failed or token missing in WebSocket handshake request.");
//        response.setStatusCode(HttpStatus.FORBIDDEN);  // No Authorization header or invalid token
//        return false;  // Reject the handshake
//    }
//
//    @Override
//    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler, Exception exception) {
//        // No specific action needed here
//    }
//}
//
