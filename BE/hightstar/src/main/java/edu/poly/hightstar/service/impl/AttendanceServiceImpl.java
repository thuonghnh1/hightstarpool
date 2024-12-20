package edu.poly.hightstar.service.impl;

import java.time.LocalTime;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.poly.hightstar.domain.Attendance;
import edu.poly.hightstar.domain.Ticket;
import edu.poly.hightstar.enums.TicketType;
import edu.poly.hightstar.model.AttendanceDTO;
import edu.poly.hightstar.model.QRCodeValidationResponse;
import edu.poly.hightstar.model.TicketDTO;
import edu.poly.hightstar.repository.AttendanceRepository;
import edu.poly.hightstar.repository.TicketRepository;
import edu.poly.hightstar.service.AttendanceService;
import edu.poly.hightstar.service.QRCodeValidationService;
import edu.poly.hightstar.utils.exception.AppException;
import edu.poly.hightstar.utils.exception.ErrorCode;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AttendanceServiceImpl implements AttendanceService {
    private final AttendanceRepository attendanceRepository;
    private final TicketRepository ticketRepository;
    private final QRCodeValidationService qrCodeValidationService;

    @Override
    @Transactional
    public List<AttendanceDTO> getAllAttendances() {
        return attendanceRepository.findAll().stream().map(attendance -> {
            AttendanceDTO dto = new AttendanceDTO();

            if (attendance.getTicket() != null && attendance.getTicket().getClassStudentEnrollment() != null) {
                dto.setClassStudentEnrollmentId(
                        attendance.getTicket().getClassStudentEnrollment().getClassStudentEnrollmentId());
            } else {
                dto.setClassStudentEnrollmentId(null);
            }

            // Set ticketId
            if (attendance.getTicket() != null) {
                dto.setTicketId(attendance.getTicket().getTicketId());
            }

            // Copy các thuộc tính khác
            BeanUtils.copyProperties(attendance, dto, "ticket");
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public List<AttendanceDTO> getAttendancesWithoutCheckOut() {
        return attendanceRepository.findByCheckOutTimeIsNull().stream().map(attendance -> {
            AttendanceDTO dto = new AttendanceDTO();

            if (attendance.getTicket() != null && attendance.getTicket().getClassStudentEnrollment() != null) {
                dto.setClassStudentEnrollmentId(
                        attendance.getTicket().getClassStudentEnrollment().getClassStudentEnrollmentId());
            } else {
                dto.setClassStudentEnrollmentId(null);
            }

            if (attendance.getTicket() != null) {
                dto.setTicketId(attendance.getTicket().getTicketId());
            }

            // Copy các thuộc tính khác
            BeanUtils.copyProperties(attendance, dto, "ticket");

            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public AttendanceDTO getAttendanceById(Long id) {
        Attendance attendance = attendanceRepository.findById(id)
                .orElseThrow(() -> new AppException("Điểm danh này không tồn tại!", ErrorCode.ATTENDANCE_NOT_FOUND));

        AttendanceDTO attendanceDTO = new AttendanceDTO();
        BeanUtils.copyProperties(attendance, attendanceDTO, "ticket");

        if (attendance.getTicket() != null && attendance.getTicket().getClassStudentEnrollment() != null) {
            attendanceDTO.setClassStudentEnrollmentId(
                    attendance.getTicket().getClassStudentEnrollment().getClassStudentEnrollmentId());
        } else {
            attendanceDTO.setClassStudentEnrollmentId(null);
        }

        if (attendance.getTicket() != null) {
            attendanceDTO.setTicketId(attendance.getTicket().getTicketId());
        }

        return attendanceDTO;
    }

    // Hàm kiểm tra đã checkout chưa (Và sử dụng ở ticket khi lấy mảng để biết trạng
    // thái vé đã dùng hay chưa)
    @Override
    public boolean hasCheckedOutWithTicket(Long ticketId) {
        return attendanceRepository.findByTicketId(ticketId)
                .map(attendance -> attendance.getCheckOutTime() != null)
                .orElse(false); // Trả về false nếu không tìm thấy Attendance
    }

    @Override
    @Transactional
    public AttendanceDTO createAttendance(AttendanceDTO attendanceDTO) {

        Date today = getCurrentDateWithoutTime();

        Attendance attendance = new Attendance();
        BeanUtils.copyProperties(attendanceDTO, attendance, "ticket");

        if (attendanceDTO.getTicketId() == null) {
            throw new AppException("Vé bơi không được phép để trống!", ErrorCode.INVALID_INPUT);
        }

        // Kiểm tra ticketId
        if (attendanceDTO.getTicketId() != null) {
            Ticket ticket = ticketRepository.findById(attendanceDTO.getTicketId())
                    .orElseThrow(() -> new AppException("Không tìm thấy vé với ID " + attendanceDTO.getTicketId(),
                            ErrorCode.TICKET_NOT_FOUND));

            // Kiểm tra trùng lặp bản ghi
            Optional<Attendance> existingAttendance;
            if (ticket.getClassStudentEnrollment() != null) {
                existingAttendance = attendanceRepository.findByClassStudentEnrollmentIdAndTicketIdAndAttendanceDate(
                        ticket.getClassStudentEnrollment().getClassStudentEnrollmentId(),
                        attendanceDTO.getTicketId(),
                        today);
            } else {
                existingAttendance = attendanceRepository
                        .findByClassStudentEnrollmentIsNullAndTicketIdAndAttendanceDate(
                                attendanceDTO.getTicketId(), today);
            }

            if (existingAttendance.isPresent()) {
                // Xử lý khi đã tồn tại
                throw new AppException("Bản ghi điểm danh đã tồn tại cho vé này trong ngày hiện tại!",
                        ErrorCode.DUPLICATE_ENTRY);
            }

            if (ticket.getTicketType() == TicketType.STUDENT_TICKET) {
                if (ticket.getClassStudentEnrollment() != null) {
                    // Không cần thiết lập trực tiếp Student trong Attendance
                    // Mối quan hệ thông qua Ticket và ClassStudentEnrollment
                } else {
                    throw new AppException("Không tìm thấy enrollment cho vé bơi này!",
                            ErrorCode.USER_NOT_FOUND);
                }
            }

            attendance.setTicket(ticket);
        }

        // Log các giá trị quan trọng
        System.out.println(
                "Creating attendance with ClassStudentEnrollment ID: " + attendanceDTO.getClassStudentEnrollmentId());
        System.out.println("Creating attendance with Ticket ID: " + attendanceDTO.getTicketId());
        System.out.println("Creating attendance with Attendance Date: " + attendanceDTO.getAttendanceDate());

        // Lưu xuống DB
        Attendance createdAttendance = attendanceRepository.save(attendance);

        AttendanceDTO createdAttendanceDTO = new AttendanceDTO();
        BeanUtils.copyProperties(createdAttendance, createdAttendanceDTO, "ticket");

        if (createdAttendance.getTicket() != null
                && createdAttendance.getTicket().getClassStudentEnrollment() != null) {
            createdAttendanceDTO.setClassStudentEnrollmentId(
                    createdAttendance.getTicket().getClassStudentEnrollment().getClassStudentEnrollmentId());
        } else {
            createdAttendanceDTO.setClassStudentEnrollmentId(null);
        }
        createdAttendanceDTO.setTicketId(
                createdAttendance.getTicket() != null ? createdAttendance.getTicket().getTicketId() : null);

        return createdAttendanceDTO;
    }

    @Override
    @Transactional
    public AttendanceDTO updateAttendance(Long id, AttendanceDTO attendanceDTO) {
        Attendance attendance = attendanceRepository.findById(id)
                .orElseThrow(() -> new AppException("Điểm danh này không tồn tại!", ErrorCode.ATTENDANCE_NOT_FOUND));

        Ticket oldTicket = attendance.getTicket();

        BeanUtils.copyProperties(attendanceDTO, attendance, "ticket");

        // Nếu ticketId là null thì ném ngoại lệ, vì vé không được phép là null
        if (attendanceDTO.getTicketId() == null) {
            throw new AppException("Vé bơi không được phép để trống!", ErrorCode.INVALID_INPUT);
        }

        Ticket newTicket = ticketRepository.findById(attendanceDTO.getTicketId())
                .orElseThrow(() -> new AppException("Không tìm thấy vé với ID " + attendanceDTO.getTicketId(),
                        ErrorCode.TICKET_NOT_FOUND));

        // Kiểm tra nếu ticket bị thay đổi hoặc attendanceDate bị thay đổi
        boolean ticketChanged = (oldTicket == null || !oldTicket.getTicketId().equals(newTicket.getTicketId()))
                || !attendance.getAttendanceDate().equals(attendanceDTO.getAttendanceDate());

        if (ticketChanged) {
            // Kiểm tra trùng lặp
            Optional<Attendance> existingAttendance;
            if (newTicket.getClassStudentEnrollment() != null) {
                existingAttendance = attendanceRepository.findByClassStudentEnrollmentIdAndTicketIdAndAttendanceDate(
                        newTicket.getClassStudentEnrollment().getClassStudentEnrollmentId(),
                        attendanceDTO.getTicketId(),
                        attendanceDTO.getAttendanceDate());
            } else {
                existingAttendance = attendanceRepository
                        .findByClassStudentEnrollmentIsNullAndTicketIdAndAttendanceDate(
                                attendanceDTO.getTicketId(),
                                attendanceDTO.getAttendanceDate());
            }

            if (existingAttendance.isPresent() && !existingAttendance.get().getAttendanceId().equals(id)) {
                // Đảm bảo rằng bản ghi tìm thấy không phải chính nó
                throw new AppException("Đã tồn tại bản ghi trùng lặp với vé và ngày này!",
                        ErrorCode.DUPLICATE_ENTRY);
            }

            if (newTicket.getTicketType() == TicketType.STUDENT_TICKET) {
                if (newTicket.getClassStudentEnrollment() != null) {
                    // Không cần thiết lập trực tiếp Student trong Attendance
                    // Mối quan hệ thông qua Ticket và ClassStudentEnrollment
                } else {
                    throw new AppException("Không tìm thấy enrollment cho vé bơi này!",
                            ErrorCode.USER_NOT_FOUND);
                }
            }
        }

        attendance.setTicket(newTicket);

        Attendance updatedAttendance = attendanceRepository.save(attendance);

        AttendanceDTO updatedAttendanceDTO = new AttendanceDTO();
        BeanUtils.copyProperties(updatedAttendance, updatedAttendanceDTO, "ticket");

        if (updatedAttendance.getTicket() != null
                && updatedAttendance.getTicket().getClassStudentEnrollment() != null) {
            updatedAttendanceDTO.setClassStudentEnrollmentId(
                    updatedAttendance.getTicket().getClassStudentEnrollment().getClassStudentEnrollmentId());
        } else {
            updatedAttendanceDTO.setClassStudentEnrollmentId(null);
        }
        updatedAttendanceDTO.setTicketId(
                updatedAttendance.getTicket() != null ? updatedAttendance.getTicket().getTicketId() : null);

        return updatedAttendanceDTO;
    }

    @Override
    public void deleteAttendance(Long id) {
        if (!attendanceRepository.existsById(id)) {
            throw new AppException("Điểm danh này không tồn tại!", ErrorCode.ATTENDANCE_NOT_FOUND);
        }
        attendanceRepository.deleteById(id);
    }

    @Override
    @Transactional
    public AttendanceDTO scanQRCode(String ticketCode) { // Đổi tham số từ qrCodeBase64 thành ticketCode
        // Bước 1: Xác thực mã QR và lấy thông tin vé
        QRCodeValidationResponse validationResponse = qrCodeValidationService.validateQRCode(ticketCode);

        if (!validationResponse.isValid()) {
            throw new AppException(validationResponse.getMessage(), ErrorCode.INVALID_QR_CODE);
        }

        TicketDTO ticketDTO = validationResponse.getTicketDto();
        Long classStudentEnrollmentId = ticketDTO.getClassStudentEnrollmentId();
        Long ticketId = ticketDTO.getTicketId();
        Date today = getCurrentDateWithoutTime();

        // Bước 2: Tìm bản ghi điểm danh cho học viên hoặc khách bơi hôm nay
        Attendance attendance;
        if (classStudentEnrollmentId != null) {
            // Trường hợp học viên
            Optional<Attendance> optionalAttendance = attendanceRepository
                    .findByClassStudentEnrollmentIdAndTicketIdAndAttendanceDate(classStudentEnrollmentId, ticketId,
                            today);

            if (optionalAttendance.isPresent()) {
                // Nếu đã có bản ghi điểm danh hôm nay
                attendance = optionalAttendance.get();
                if (attendance.getCheckOutTime() != null) {
                    throw new AppException("Vé đã được quét ra.", ErrorCode.INVALID_OPERATION);
                }
                // Thực hiện check-out
                attendance.setCheckOutTime(LocalTime.now()); // Sử dụng timestamp hiện tại
                // Tính toán penaltyAmount nếu cần thiết (ví dụ: nếu check-out trễ)
                // attendance.setPenaltyAmount(calculatePenalty(attendance));
            } else {
                // Nếu chưa có bản ghi điểm danh hôm nay, thực hiện check-in
                attendance = new Attendance();
                attendance.setAttendanceDate(today);
                attendance.setCheckInTime(LocalTime.now()); // Sử dụng timestamp hiện tại

                // Lấy đối tượng Ticket từ repository
                Ticket ticket = ticketRepository.findById(ticketId)
                        .orElseThrow(() -> new AppException("Không tìm thấy vé với ID: " + ticketId,
                                ErrorCode.TICKET_NOT_FOUND));

                attendance.setTicket(ticket);
                attendance.setPenaltyAmount(0.0); // Khởi tạo penalty
            }
        } else {
            // Trường hợp người bơi bình thường (classStudentEnrollmentId null)
            Optional<Attendance> optionalAttendance = attendanceRepository
                    .findByClassStudentEnrollmentIsNullAndTicketIdAndAttendanceDate(ticketId, today);

            if (optionalAttendance.isPresent()) {
                // Nếu đã có bản ghi điểm danh hôm nay
                attendance = optionalAttendance.get();
                if (attendance.getCheckOutTime() != null) {
                    throw new AppException("Vé này đã được sử dụng trước đó!", ErrorCode.INVALID_OPERATION);
                }
                // Thực hiện check-out
                attendance.setCheckOutTime(LocalTime.now());
                // Tính toán penaltyAmount nếu cần thiết (ví dụ: nếu check-out trễ)
                // attendance.setPenaltyAmount(calculatePenalty(attendance));
            } else {
                // Nếu chưa có bản ghi điểm danh hôm nay, thực hiện check-in
                attendance = new Attendance();
                attendance.setAttendanceDate(today);
                attendance.setCheckInTime(LocalTime.now());

                // Lấy đối tượng Ticket từ repository
                Ticket ticket = ticketRepository.findById(ticketId)
                        .orElseThrow(() -> new AppException("Không tìm thấy vé với ID: " + ticketId,
                                ErrorCode.TICKET_NOT_FOUND));

                attendance.setTicket(ticket);
                // Không set student, vì người bơi bình thường
                attendance.setPenaltyAmount(0.0); // Khởi tạo penalty
            }
        }

        // Bước 3: Lưu hoặc cập nhật bản ghi điểm danh
        Attendance updatedAttendance = attendanceRepository.save(attendance);

        // Bước 4: Chuyển đổi thành DTO để trả về
        AttendanceDTO attendanceDTO = new AttendanceDTO();
        BeanUtils.copyProperties(updatedAttendance, attendanceDTO, "ticket");

        if (updatedAttendance.getTicket() != null
                && updatedAttendance.getTicket().getClassStudentEnrollment() != null) {
            attendanceDTO.setClassStudentEnrollmentId(
                    updatedAttendance.getTicket().getClassStudentEnrollment().getClassStudentEnrollmentId());
        } else {
            attendanceDTO.setClassStudentEnrollmentId(null);
        }

        attendanceDTO.setTicketId(
                updatedAttendance.getTicket() != null ? updatedAttendance.getTicket().getTicketId() : null);

        return attendanceDTO;
    }

    // Phương thức trợ giúp để lấy ngày hiện tại mà không có thời gian
    private Date getCurrentDateWithoutTime() {
        Calendar cal = Calendar.getInstance();
        cal.set(Calendar.HOUR_OF_DAY, 0);
        cal.set(Calendar.MINUTE, 0);
        cal.set(Calendar.SECOND, 0);
        cal.set(Calendar.MILLISECOND, 0);
        return cal.getTime();
    }

    // Phương thức trợ giúp để tính toán penaltyAmount nếu cần thiết
    // private Double calculatePenalty(Attendance attendance) {
    // // Logic tính toán penalty dựa trên thời gian check-in và check-out
    // return 0.0;
    // }
}
