package com.microservices.api_gateway.services;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class ErrorResponseService {

    public ResponseEntity<Map<String, String>> mapToResponseEntity(Map<String, String> response) {
        if (response.containsKey("NOT_FOUND")) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        if (response.containsKey("FORBIDDEN")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
        }

        if (response.containsKey("UNAUTHORIZED")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        if (response.containsKey("BAD_REQUEST")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        if (response.containsKey("INTERNAL_SERVER_ERROR")) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }


        return ResponseEntity.ok(response);
    }

}
