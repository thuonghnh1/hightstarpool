package edu.poly.hightstar.controller.admin;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.poly.hightstar.model.TimeSlotDTO;
import edu.poly.hightstar.service.TimeSlotService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/timeSlots")
@RequiredArgsConstructor
public class TimeSlotController {
    private final TimeSlotService timeSlotService;

    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE', 'TRAINER')")
    @GetMapping
    public List<TimeSlotDTO> getAllTimeSlots() {
        return timeSlotService.getAllTimeSlots();
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE', 'TRAINER')")
    @GetMapping("/{id}")
    public ResponseEntity<TimeSlotDTO> getTimeSlotById(@PathVariable Long id) {
        TimeSlotDTO timeSlotDTO = timeSlotService.getTimeSlotById(id);
        if (timeSlotDTO == null) {
            return ResponseEntity.notFound().build(); // 404 Not Found nếu không tìm thấy
        }
        return ResponseEntity.ok(timeSlotDTO); // 200 OK với discountDto
    }

    @PostMapping
    public ResponseEntity<TimeSlotDTO> createTimeSlot(@RequestBody TimeSlotDTO timeSlotDTO) {
        TimeSlotDTO createdTimeSlot = timeSlotService.createTimeSlot(timeSlotDTO);

        // trả về phản hồi với mã trạng thái(HTTP 201 created), body là phần thân p/hồi
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTimeSlot);

    }

    @PutMapping("/{id}")
    public ResponseEntity<TimeSlotDTO> updateTimeSlot(@PathVariable Long id, @RequestBody TimeSlotDTO timeSlotDTO) {
        TimeSlotDTO updatedTimeSlot = timeSlotService.updateTimeSlot(id, timeSlotDTO);

        return ResponseEntity.ok(updatedTimeSlot);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTimeSlot(@PathVariable Long id) {
        timeSlotService.deleteTimeSlot(id);
        return ResponseEntity.ok("TimeSlot deleted successfully."); // 200 OK với thông điệp
    }
}
