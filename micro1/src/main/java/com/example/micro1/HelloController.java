package com.example.micro1;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
public class HelloController {

    private final HelloComponent helloComponent;

    public HelloController(HelloComponent helloComponent) {
        this.helloComponent = helloComponent;
    }

    @CrossOrigin
    @GetMapping("/hello")
    public Mono<String> getHello() {
        String greeting = helloComponent.getGreeting();
        return helloComponent.getName().map(name -> "%s %s!".formatted(greeting, name));
    }

}
