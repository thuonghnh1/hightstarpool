package edu.poly.hightstar.controller.sites;

import edu.poly.hightstar.model.RegisterDTO;
import edu.poly.hightstar.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user/register")
public class RegisterController {

    private final UserService userService;

    @PostMapping
    public ResponseEntity<Object> registerUser(@RequestBody RegisterDTO registerDTO) {
        Map<String, String> response = new HashMap<>();

        if (userService.isEmailExists(registerDTO.getEmail())) {
            response.put("message", "Email đã tồn tại");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        if (userService.isPhoneNumberExists(registerDTO.getPhoneNumber())) {
            response.put("message", "Số điện thoại đã tồn tại");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        try {
            userService.registerUser(registerDTO);
            response.put("message", "Đăng ký thành công");
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (Exception e) {
            response.put("message", "Đã xảy ra lỗi: " + e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
