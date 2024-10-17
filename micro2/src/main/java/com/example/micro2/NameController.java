package com.example.micro2;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class NameController {

    private final NameComponent nameComponent;

    public NameController(NameComponent helloComponent) {
        this.nameComponent = helloComponent;
    }

    @CrossOrigin
    @GetMapping(value = "/name", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> getName() {
        return ResponseEntity.ok(nameComponent.getName());
    }

    static public class NameRequest {
        private String name;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }
    }

    @CrossOrigin
    @PostMapping(value = "/name", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> setName(@RequestBody NameRequest nameRequest) {
        nameComponent.setName(nameRequest.getName());
        return ResponseEntity.noContent().build();
    }

}
