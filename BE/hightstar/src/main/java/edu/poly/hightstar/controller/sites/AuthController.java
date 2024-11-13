package edu.poly.hightstar.controller.sites;

import edu.poly.hightstar.model.LoginDTO;
import edu.poly.hightstar.model.LoginResponse;
import edu.poly.hightstar.model.RegisterDTO;
import edu.poly.hightstar.model.SendOtpRequestDTO;
import edu.poly.hightstar.model.UserDTO;
import edu.poly.hightstar.service.OtpService;
import edu.poly.hightstar.service.UserService;
import edu.poly.hightstar.utils.jwt.JwtTokenProvider;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;
    private final OtpService otpService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> loginUser(@RequestBody LoginDTO loginDTO, HttpServletResponse response) {
        LoginResponse loginResponse = userService.loginUser(loginDTO, response);
        return new ResponseEntity<>(loginResponse, HttpStatus.OK);
    }

    @PostMapping("/register")
    public ResponseEntity<Object> registerUser(@RequestBody RegisterDTO userData) {
        userService.registerUser(userData);
        return new ResponseEntity<>("Đăng ký thành công, vui lòng đăng nhập để tiếp tục!", HttpStatus.CREATED);
    }

    @PostMapping("/send-otp")
    public ResponseEntity<Object> sendOtp(@RequestBody SendOtpRequestDTO request) {
        String identifier = request.getIdentifier();
        UserDTO userData = request.getUserData();

        String email = "";
        if (identifier.contains("@")) { // identifier là email nếu có '@'
            boolean isEmailExists = userService.isEmailExists(identifier);

            if (userData != null) {
                String phoneNumber = userData.getPhoneNumber();
                boolean isPhoneNumberExists = userService.isPhoneNumberExists(phoneNumber);

                if (isPhoneNumberExists) {
                    return new ResponseEntity<>("Số điện thoại này đã được sử dụng!", HttpStatus.CONFLICT);
                }
            } else {
                return new ResponseEntity<>("Đã xảy ra lỗi. Vui lòng thử lại sau!", HttpStatus.BAD_REQUEST);
            }

            if (isEmailExists) {
                return new ResponseEntity<>("Email này đã được sử dụng!", HttpStatus.CONFLICT);
            }

            email = identifier;
        } else {
            UserDTO userDTO = userService.getUserByUsername(identifier);
            email = userDTO.getEmail();
        }
        String otp = otpService.sendOtp(identifier, email);
        System.out.println("OTP của bạn là: " + otp);
        return new ResponseEntity<>("Mã OTP đã được gửi. Vui lòng kiểm tra email của bạn!", HttpStatus.OK);
    }

    // Endpoint resend OTP
    @PostMapping("/resend-otp")
    public ResponseEntity<Object> resendOtp(@RequestBody SendOtpRequestDTO request) {
        String identifier = request.getIdentifier();
        UserDTO userData = request.getUserData();

        String email = "";
        if (identifier.contains("@")) { // identifier là email nếu có '@'
            boolean isEmailExists = userService.isEmailExists(identifier);

            if (userData != null) {
                String phoneNumber = userData.getPhoneNumber();
                boolean isPhoneNumberExists = userService.isPhoneNumberExists(phoneNumber);

                if (isPhoneNumberExists) {
                    return new ResponseEntity<>("Số điện thoại này đã được sử dụng!", HttpStatus.CONFLICT);
                }
            } else {
                return new ResponseEntity<>("Đã xảy ra lỗi. Vui lòng thử lại sau!", HttpStatus.BAD_REQUEST);
            }

            if (isEmailExists) {
                return new ResponseEntity<>("Email này đã được sử dụng!", HttpStatus.CONFLICT);
            }

            email = identifier;
        } else {
            UserDTO userDTO = userService.getUserByUsername(identifier);
            email = userDTO.getEmail();
        }
        String otp = otpService.sendOtp(identifier, email);
        System.out.println("OTP mới của bạn là: " + otp);
        return new ResponseEntity<>("Mã OTP mới đã được gửi lại. Vui lòng kiểm tra email của bạn!", HttpStatus.OK);
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<Object> verifyOtp(@RequestBody Map<String, String> request) {
        String identifier = request.get("identifier");
        String otp = request.get("otp");

        if (otpService.validateOtp(identifier, otp)) {
            return ResponseEntity.ok("Xác thực thành công!");
        } else {
            return new ResponseEntity<>("Mã OTP không hợp lệ hoặc đã hết hạn.", HttpStatus.UNAUTHORIZED);
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Object> resetPassword(@RequestBody Map<String, String> request) {
        String phoneNumber = request.get("phoneNumber");
        String newPassword = request.get("newPassword");

        if (userService.resetPassword(phoneNumber, newPassword)) {
            return ResponseEntity.ok("Đặt lại mật khẩu thành công!");
        } else {
            return new ResponseEntity<>("Không thể đặt lại mật khẩu, vui lòng thử lại!", HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<Map<String, String>> refreshToken(@RequestHeader("Authorization") String refreshToken) {
        try {
            if (refreshToken != null && refreshToken.startsWith("Bearer ")) {
                refreshToken = refreshToken.substring(7);
            }
            if (jwtTokenProvider.validateToken(refreshToken)) {
                String username = jwtTokenProvider.getUsernameFromJWT(refreshToken);

                // Lấy thông tin người dùng từ csdl
                UserDTO userDTO = userService.getUserByUsername(username);
                // Tạo token mới với danh sách vai trò chính xác
                String newAccessToken = jwtTokenProvider.generateToken(username, List.of(userDTO.getRole()),
                        userDTO.getUserId());

                Map<String, String> tokens = new HashMap<>();
                tokens.put("accessToken", "Bearer " + newAccessToken);
                return ResponseEntity.ok(tokens);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
}
