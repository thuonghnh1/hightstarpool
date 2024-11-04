package edu.poly.hightstar.controller.admin;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import edu.poly.hightstar.model.UserDTO;
import edu.poly.hightstar.service.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<UserDTO> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        UserDTO userDto = userService.getUserById(id);
        if (userDto == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(userDto);
    }

    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody UserDTO userDto) {
        if (userService.isPhoneNumberExists(userDto.getPhoneNumber())) {
            System.out.println("--------------------"+userDto.getPhoneNumber());
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Số điện thoại này đã được sử dụng");
        }

        if (userService.isEmailExists(userDto.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email này đã được sử dụng");
        }
        System.out.println("-------------------- Đã tới đay");
        UserDTO create = userService.createUser(userDto);
        // trả về phản hồi với mã trạng thái(HTTP 201 created), body là phần thân p/hồi
        return ResponseEntity.status(HttpStatus.CREATED).body(create);

    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody UserDTO userDto) {

        UserDTO update = userService.updateUser(id, userDto);
        if (update == null) {
            return ResponseEntity.notFound().build();
        }

        // Kiểm tra email trong User của các User khác
        if (userService.isEmailExistsForUpdate(userDto.getEmail(), userDto.getUserId())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email này đã được sử dụng");
        }

        return ResponseEntity.ok(update);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok("User deleted successfully."); // 200 OK với thông điệp
    }
}
