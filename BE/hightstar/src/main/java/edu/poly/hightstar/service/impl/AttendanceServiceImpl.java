package edu.poly.hightstar.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import edu.poly.hightstar.domain.Attendance;
import edu.poly.hightstar.domain.Student;
import edu.poly.hightstar.domain.Ticket;
import edu.poly.hightstar.model.AttendanceDTO;
import edu.poly.hightstar.repository.AttendanceRepository;
import edu.poly.hightstar.repository.StudentRepository;
import edu.poly.hightstar.repository.TicketRepository;
import edu.poly.hightstar.service.AttendanceService;
import edu.poly.hightstar.utils.exception.AppException;
import edu.poly.hightstar.utils.exception.ErrorCode;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AttendanceServiceImpl implements AttendanceService {
    private final AttendanceRepository attendanceRepository;
    private final TicketRepository ticketRepository;
    private final StudentRepository studentRepository;

    @Override
    public List<AttendanceDTO> getAllAttendances() {
        return attendanceRepository.findAll().stream().map(attendance -> {
            AttendanceDTO dto = new AttendanceDTO();

            if (attendance.getStudent() != null) {
                dto.setStudentId(attendance.getStudent().getStudentId());
            }
            if (attendance.getTicket() != null) {
                dto.setTicketId(attendance.getTicket().getTicketId());
            }
            BeanUtils.copyProperties(attendance, dto);
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public AttendanceDTO getAttendanceById(Long id) {
        Attendance attendance = attendanceRepository.findById(id)
                .orElseThrow(() -> new AppException("Điểm danh này không tồn tại!", ErrorCode.ATTENDANCE_NOT_FOUND));

        AttendanceDTO attendanceDTO = new AttendanceDTO();
        BeanUtils.copyProperties(attendance, attendanceDTO);
        return attendanceDTO;
    }

    @Override
    public AttendanceDTO createAttendance(AttendanceDTO attendanceDTO) {
        Attendance attendance = new Attendance();
        // Sao chép các thuộc tính từ attendanceDTO sang attendance (trừ student)
        BeanUtils.copyProperties(attendanceDTO, attendance, "student", "ticket");

        // Kiểm tra nếu studentId khác null
        if (attendanceDTO.getStudentId() != null) {
            Student student = studentRepository.findById(attendanceDTO.getStudentId())
                    .orElseThrow(
                            () -> new AppException("Không tìm thấy học viên với ID " + attendanceDTO.getStudentId(),
                                    ErrorCode.USER_NOT_FOUND));
            attendance.setStudent(student);
        } else {
            // Nếu studentId là null, thiết lập student của attendance thành null
            attendance.setStudent(null);
        }

        // Kiểm tra nếu ticketId khác null
        if (attendanceDTO.getTicketId() != null) {
            Ticket ticket = ticketRepository.findById(attendanceDTO.getTicketId())
                    .orElseThrow(
                            () -> new AppException("Không tìm thấy vé với ID " + attendanceDTO.getTicketId(),
                                    ErrorCode.TICKET_NOT_FOUND));
            attendance.setTicket(ticket);
        } else {
            // Nếu ticketId là null, thiết lập ticket của attendance thành null
            attendance.setTicket(null);
        }

        // Lưu attendance vào cơ sở dữ liệu
        Attendance createdAttendance = attendanceRepository.save(attendance);

        // Chuẩn bị DTO để trả về
        AttendanceDTO createdAttendanceDTO = new AttendanceDTO();
        BeanUtils.copyProperties(createdAttendance, createdAttendanceDTO);

        // Kiểm tra nếu student không null, thiết lập studentId vào DTO
        if (createdAttendance.getStudent() != null) {
            createdAttendanceDTO.setStudentId(createdAttendance.getStudent().getStudentId());
        } else {
            createdAttendanceDTO.setStudentId(null); // Đảm bảo studentId là null khi student là null
        }

        // Kiểm tra nếu ticket không null, thiết lập ticketId vào DTO
        if (createdAttendance.getTicket() != null) {
            createdAttendanceDTO.setTicketId(createdAttendance.getTicket().getTicketId());
        } else {
            createdAttendanceDTO.setTicketId(null); // Đảm bảo ticketId là null khi ticket là null
        }

        return createdAttendanceDTO;
    }

    @Override
    public AttendanceDTO updateAttendance(Long id, AttendanceDTO attendanceDTO) {
        // Tìm vé theo ID, nếu không tồn tại thì ném AppException
        Attendance attendance = attendanceRepository.findById(id)
                .orElseThrow(() -> new AppException("Điểm danh này không tồn tại!", ErrorCode.ATTENDANCE_NOT_FOUND));

        // Sao chép các thuộc tính từ AttendanceDTO sang Attendance (trừ student)
        BeanUtils.copyProperties(attendanceDTO, attendance, "student", "ticket");

        // Kiểm tra xem attendanceDTO có chứa studentId không
        if (attendanceDTO.getStudentId() != null) {
            // Nếu studentId khác null, tìm student theo ID
            Student student = studentRepository.findById(attendanceDTO.getStudentId())
                    .orElseThrow(
                            () -> new AppException("Không tìm thấy học viên với ID " + attendanceDTO.getStudentId(),
                                    ErrorCode.STUDENT_NOT_FOUND));
            // Thiết lập student cho attendance
            attendance.setStudent(student);
        } else {
            // Nếu studentId là null, đặt student của attendance thành null
            attendance.setStudent(null);
        }

        // Kiểm tra xem attendanceDTO có chứa ticketId không
        if (attendanceDTO.getTicketId() != null) {
            // Nếu ticketId khác null, tìm ticket theo ID
            Ticket ticket = ticketRepository.findById(attendanceDTO.getTicketId())
                    .orElseThrow(
                            () -> new AppException("Không tìm thấy vé với ID " + attendanceDTO.getTicketId(),
                                    ErrorCode.TICKET_NOT_FOUND));
            // Thiết lập ticket cho attendance
            attendance.setTicket(ticket);
        } else {
            // Nếu ticketId là null, đặt ticket của attendance thành null
            attendance.setTicket(null);
        }

        // Lưu attendance đã cập nhật vào cơ sở dữ liệu
        Attendance updatedAttendance = attendanceRepository.save(attendance);

        // Chuẩn bị đối tượng DTO để trả về
        AttendanceDTO updatedAttendanceDTO = new AttendanceDTO();
        BeanUtils.copyProperties(updatedAttendance, updatedAttendanceDTO);

        // Kiểm tra nếu student không null, thiết lập studentId vào DTO
        if (updatedAttendance.getStudent() != null) {
            updatedAttendanceDTO.setStudentId(updatedAttendance.getStudent().getStudentId());
        } else {
            updatedAttendanceDTO.setStudentId(null); // Đảm bảo studentId là null khi student là null
        }

        // Kiểm tra nếu ticket không null, thiết lập ticketId vào DTO
        if (updatedAttendance.getTicket() != null) {
            updatedAttendanceDTO.setTicketId(updatedAttendance.getTicket().getTicketId());
        } else {
            updatedAttendanceDTO.setTicketId(null); // Đảm bảo ticketId là null khi ticket là null
        }

        return updatedAttendanceDTO;
    }

    @Override
    public void deleteAttendance(Long id) {
        if (!attendanceRepository.existsById(id)) {
            throw new AppException("Điểm danh này không tồn tại!", ErrorCode.ATTENDANCE_NOT_FOUND);
        }
        attendanceRepository.deleteById(id);
    }
}
