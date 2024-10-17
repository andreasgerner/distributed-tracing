package com.example.micro2;

import org.springframework.stereotype.Component;

@Component
public class NameComponent {

    private final NameRepository nameRepository;

    public NameComponent(NameRepository nameRepository) {
        this.nameRepository = nameRepository;
    }

    public String getName() {
        return nameRepository.findById(0L).map(NameEntity::getName).orElse("World");
    }

    public void setName(String name) {
        final NameEntity entity = nameRepository.findById(0L).orElseThrow(RuntimeException::new);
        entity.setName(name);
        nameRepository.saveAndFlush(entity);
    }

}
