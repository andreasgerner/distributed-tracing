package com.example.micro2;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class NameController {

    private final NameComponent nameComponent;

    public NameController(NameComponent helloComponent) {
        this.nameComponent = helloComponent;
    }

    @GetMapping("/name")
    public ResponseEntity<String> getName() {
        return ResponseEntity.ok(nameComponent.getName());
    }

}
