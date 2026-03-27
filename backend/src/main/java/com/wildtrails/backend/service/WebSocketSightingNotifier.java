package com.wildtrails.backend.service;

import com.wildtrails.backend.entity.AnimalSighting;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Component
public class WebSocketSightingNotifier {

//  private final SimpMessagingTemplate messagingTemplate;
//
//  @Autowired
//  public WebSocketSightingNotifier(SimpMessagingTemplate messagingTemplate) {
//    this.messagingTemplate = messagingTemplate;
//  }
//
//  public void notifyNewSighting(AnimalSighting sighting) {
//    messagingTemplate.convertAndSend("/topic/sightings", sighting);
//  }
}
