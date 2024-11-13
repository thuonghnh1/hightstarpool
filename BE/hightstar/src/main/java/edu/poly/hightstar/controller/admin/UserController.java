package edu.poly.hightstar.controller.admin;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import edu.poly.hightstar.model.UserDTO;
import edu.poly.hightstar.service.UserService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/employee/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public List<UserDTO> getAllUsers() {
        return userService.getAllUsers();
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE', 'TRAINER' , 'USER')")
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        UserDTO userDto = userService.getUserById(id);
        return ResponseEntity.ok(userDto);
    }

    @GetMapping("/search-by-username")
    public ResponseEntity<?> getUserByUsername(@RequestParam String username) {
        UserDTO userDto = userService.getUserByUsername(username);
        return ResponseEntity.ok(userDto);
    }

    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody UserDTO userDto) {
        UserDTO createDto = userService.createUser(userDto);
        return ResponseEntity.ok(createDto);
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

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok("User deleted successfully."); // 200 OK với thông điệp
    }
}
