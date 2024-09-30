package com.example.micro2;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
public class NameController {

    private final NameComponent nameComponent;

    public NameController(NameComponent helloComponent) {
        this.nameComponent = helloComponent;
    }

    @GetMapping("/name")
    public Mono<String> getName() {
        return nameComponent.getName();
    }

}
