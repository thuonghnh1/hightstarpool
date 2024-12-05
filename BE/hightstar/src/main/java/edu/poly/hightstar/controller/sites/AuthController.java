package edu.poly.hightstar.controller.sites;

import edu.poly.hightstar.model.LoginDTO;
import edu.poly.hightstar.model.LoginResponse;
import edu.poly.hightstar.model.RegisterDTO;
import edu.poly.hightstar.model.SendOtpRequestDTO;
import edu.poly.hightstar.model.UserDTO;
import edu.poly.hightstar.service.OtpService;
import edu.poly.hightstar.service.UserService;
import edu.poly.hightstar.utils.exception.AppException;
import edu.poly.hightstar.utils.exception.ErrorCode;
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
    public ResponseEntity<String> sendOtp(@RequestBody SendOtpRequestDTO request) {
        String identifier = request.getIdentifier();
        UserDTO userData = request.getUserData();

        String email = "";
        if (identifier.contains("@")) { // identifier là email nếu có '@'
            boolean isEmailExists = userService.isEmailExists(identifier);

            if (userData != null) {
                String phoneNumber = userData.getPhoneNumber();
                boolean isPhoneNumberExists = userService.isPhoneNumberExists(phoneNumber);

                if (isPhoneNumberExists) {
                    throw new AppException("Số điện thoại này đã được sử dụng!", ErrorCode.PHONE_NUMBER_ALREADY_EXISTS);
                }
            } else {
                throw new AppException("Đã xảy ra lỗi. Vui lòng thử lại sau!", ErrorCode.INTERNAL_SERVER_ERROR);
            }

            if (isEmailExists) {
                throw new AppException("Email này đã được sử dụng!", ErrorCode.EMAIL_ALREADY_EXISTS);
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
    public ResponseEntity<String> resendOtp(@RequestBody SendOtpRequestDTO request) {
        String identifier = request.getIdentifier();
        UserDTO userData = request.getUserData();

        String email = "";
        if (identifier.contains("@")) { // identifier là email nếu có '@'
            boolean isEmailExists = userService.isEmailExists(identifier);

            if (userData != null) {
                String phoneNumber = userData.getPhoneNumber();
                boolean isPhoneNumberExists = userService.isPhoneNumberExists(phoneNumber);

                if (isPhoneNumberExists) {
                    throw new AppException("Số điện thoại này đã được sử dụng!", ErrorCode.PHONE_NUMBER_ALREADY_EXISTS);
                }
            } else {
                throw new AppException("Đã xảy ra lỗi. Vui lòng thử lại sau!", ErrorCode.INTERNAL_SERVER_ERROR);
            }

            if (isEmailExists) {
                throw new AppException("Email này đã được sử dụng!", ErrorCode.EMAIL_ALREADY_EXISTS);
            }

            email = identifier;
        } else {
            UserDTO userDTO = userService.getUserByUsername(identifier);
            email = userDTO.getEmail();
        }
        String otp = otpService.sendOtp(identifier, email);
        System.out.println("OTP mới của bạn là: " + otp);
        return new ResponseEntity<>("Mã OTP mới đã được gửi lại. Vui lòng kiểm tra email của bạn!", HttpStatus.CREATED);
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(@RequestBody Map<String, String> request) {
        String identifier = request.get("identifier");
        String otp = request.get("otp");

        if (otpService.validateOtp(identifier, otp)) {
            return ResponseEntity.ok("Xác thực thành công!");
        } else {
            throw new AppException("Mã OTP không hợp lệ hoặc đã hết hạn!", ErrorCode.INVALID_OTP);
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Object> resetPassword(@RequestBody Map<String, String> request) {
        String phoneNumber = request.get("phoneNumber");
        String newPassword = request.get("newPassword");

        if (userService.resetPassword(phoneNumber, newPassword)) {
            return ResponseEntity.ok("Đặt lại mật khẩu thành công!");
        } else {
            throw new AppException("Không thể đặt lại mật khẩu, vui lòng thử lại!", ErrorCode.INTERNAL_SERVER_ERROR);
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
