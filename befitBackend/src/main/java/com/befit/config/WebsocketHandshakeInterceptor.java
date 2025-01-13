package com.befit.config;

import io.micrometer.common.lang.Nullable;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.util.MultiValueMap;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;
import org.springframework.web.socket.server.support.HttpSessionHandshakeInterceptor;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;
import java.util.Map;

//public class WebsocketHandshakeInterceptor implements HandshakeInterceptor {
//    @Override
//    public boolean beforeHandshake(
//            ServerHttpRequest request,
//            ServerHttpResponse response,
//            WebSocketHandler wsHandler,
//            Map<String, Object> attributes) {
//        System.out.println("WebsocketHandshakeInterceptor - beforeHandshake triggered");
//        return true;
//    }
//
//    @Override
//    public void afterHandshake(
//            ServerHttpRequest request,
//            ServerHttpResponse response,
//            WebSocketHandler wsHandler,
//            @Nullable Exception exception) {
//        System.out.println("WebsocketHandshakeInterceptor - afterHandshake triggered");
//    }
//}


@Component
public class WebsocketHandshakeInterceptor extends HttpSessionHandshakeInterceptor {

    @Override
    public boolean beforeHandshake(
            ServerHttpRequest request,
            ServerHttpResponse response,
            WebSocketHandler wsHandler,
            Map<String, Object> attributes) throws Exception {

        System.out.println("WebSocketHandshakeInterceptor - beforeHandshake invoked");

        MultiValueMap<String, String> queryParams = UriComponentsBuilder.fromUri(request.getURI())
                .build()
                .getQueryParams();

        List<String> tokenList = queryParams.get("access_token");

        if (tokenList != null && !tokenList.isEmpty()) {
            String token = tokenList.get(0);
            attributes.put("token", token);
            System.out.println("Token extracted: " + token);
        } else {
            System.out.println("Token not found in query parameters");
        }

        return super.beforeHandshake(request, response, wsHandler, attributes);
    }


//    @Override
//    public boolean beforeHandshake(
//            ServerHttpRequest request,
//            ServerHttpResponse response,
//            WebSocketHandler wsHandler,
//            Map<String, Object> attributes) throws Exception {
//
//        System.out.println("WebSocketHandshakeInterceptor - beforeHandshake invoked");
//
//        MultiValueMap<String, String> queryParams = UriComponentsBuilder.fromUri(request.getURI())
//                .build()
//                .getQueryParams();
//
//        List<String> tokenList = queryParams.get("access_token");
//
//        if (tokenList != null && !tokenList.isEmpty()) {
//            String token = tokenList.get(0);
//            attributes.put("token", token);
//            System.out.println("Token extracted: " + token);
//        } else {
//            System.out.println("Token not found in query parameters");
//        }
//
//        return super.beforeHandshake(request, response, wsHandler, attributes);
//    }

    @Override
    public void afterHandshake(
            ServerHttpRequest request,
            ServerHttpResponse response,
            WebSocketHandler wsHandler,
            @Nullable Exception exception) {
        // No implementation needed
    }
}
