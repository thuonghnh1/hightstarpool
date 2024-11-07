package edu.poly.hightstar.controller.sites;

import edu.poly.hightstar.model.LoginDTO;
import edu.poly.hightstar.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user/login")
public class LoginController {

    private final UserService userService;

    @PostMapping
    public ResponseEntity<Object> loginUser(@RequestBody LoginDTO loginDTO) {
        Map<String, String> response = new HashMap<>();

        try {
            userService.loginUser(loginDTO);
            response.put("message", "Đăng nhập thành công");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            response.put("message", "Đăng nhập thất bại: " + e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
        }
    }
}
