package edu.poly.hightstar.controller.sites;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/home")
public class HomeController {

    @GetMapping
    public ResponseEntity<String> getHomePage() {
        return ResponseEntity.ok("Welcome to the Home Page! This is accessible by everyone.");
    }
}
