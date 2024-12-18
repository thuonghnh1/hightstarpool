package edu.poly.hightstar.controller.admin;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import edu.poly.hightstar.model.InfoEnrollAndBuyCourseRequest;

import edu.poly.hightstar.service.RegistrationService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/employee/registrations")
@RequiredArgsConstructor
public class RegistrationController {
    private final RegistrationService registrationService;

    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    @PostMapping("/register")
    public ResponseEntity<String> registerNewStudent(
            @RequestBody InfoEnrollAndBuyCourseRequest request) {
        registrationService.registerNewCustomerAndEnrollStudent(request);
        return new ResponseEntity<>("Đăng ký và enroll học viên thành công!", HttpStatus.CREATED);
    }

    // Enroll học viên đã tồn tại vào lớp học.
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    @PostMapping("/enroll-existing")
    public ResponseEntity<String> enrollExistingStudent(
            @RequestParam Long studentId,
            @RequestParam Long classId) {
        registrationService.enrollExistingStudentInClass(studentId, classId);
        return new ResponseEntity<>("Enroll học viên vào lớp học thành công!", HttpStatus.OK);
    }
}
