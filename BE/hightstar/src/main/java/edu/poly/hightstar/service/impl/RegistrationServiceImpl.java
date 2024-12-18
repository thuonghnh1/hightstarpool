package edu.poly.hightstar.service.impl;

import java.time.LocalDateTime;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import edu.poly.hightstar.domain.ClassEntity;
import edu.poly.hightstar.domain.ClassStudentEnrollment;
import edu.poly.hightstar.domain.Student;
import edu.poly.hightstar.domain.User;
import edu.poly.hightstar.enums.EnrollmentStatus;
import edu.poly.hightstar.enums.TicketType;
import edu.poly.hightstar.model.InfoEnrollAndBuyCourseRequest;
import edu.poly.hightstar.model.OrderRequest;
import edu.poly.hightstar.model.StudentDTO;
import edu.poly.hightstar.model.TicketDTO;
import edu.poly.hightstar.model.UserDTO;
import edu.poly.hightstar.repository.ClassRepository;
import edu.poly.hightstar.repository.ClassStudentEnrollmentRepository;
import edu.poly.hightstar.repository.StudentRepository;
import edu.poly.hightstar.service.OrderService;
import edu.poly.hightstar.service.RegistrationService;
import edu.poly.hightstar.service.TicketService;
import edu.poly.hightstar.service.UserService;
import edu.poly.hightstar.utils.exception.AppException;
import edu.poly.hightstar.utils.exception.ErrorCode;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RegistrationServiceImpl implements RegistrationService {
    private final UserService userService;
    private final StudentRepository studentRepository;
    private final ClassRepository classRepository;
    private final ClassStudentEnrollmentRepository enrollmentRepository;
    private final TicketService ticketService;
    private final OrderService orderService;

    @Override
    @Transactional
    public void registerNewCustomerAndEnrollStudent(InfoEnrollAndBuyCourseRequest request) {
        User user;
        UserDTO existingUserDTO = userService.getUserByUsername(request.getUserData().getUsername());

        if (existingUserDTO != null) {
            user = new User();
            BeanUtils.copyProperties(existingUserDTO, user);
        } else {
            UserDTO createUser = userService.createUser(request.getUserData());
            user = new User();
            BeanUtils.copyProperties(createUser, user);
        }
        // Tạo hoặc lấy Student tương ứng
        Student student = createOrGetStudent(user, request.getStudentData());

        // Đăng ký student vào lớp
        enrollStudentInClass(student, request.getClassId());

        OrderRequest orderRequest = request.getOrderRequest();
        orderRequest.getOrder().setUserId(user.getUserId());
        // Tạo hóa đơn
        orderService.createInvoice(orderRequest);
    }

    // Đăng ký học viên (đã tồn tại) vào lớp:
    @Override
    @Transactional
    public void enrollExistingStudentInClass(Long studentId, Long classId) {

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new AppException("Không tìm thấy học viên này", ErrorCode.STUDENT_NOT_FOUND));

        // Đăng ký student vào lớp
        enrollStudentInClass(student, classId);
    }

    private Student createOrGetStudent(User user, StudentDTO dto) {
        if (dto.getStudentId() != null) {
            // Học viên cũ
            return studentRepository.findById(dto.getStudentId())
                    .orElseThrow(() -> new AppException("Không tìm thấy học viên này", ErrorCode.STUDENT_NOT_FOUND));
        } else {
            // Học viên mới
            Student s = new Student();
            s.setFullName(dto.getFullName());
            s.setAge(dto.getAge());
            s.setGender(dto.getGender());
            s.setNote(dto.getNote());
            s.setUser(user);

            studentRepository.save(s);
            return s;
        }
    }

    // Thêm học viên vào lớp học
    private void enrollStudentInClass(Student student, Long classId) {
        ClassEntity cls = classRepository.findById(classId)
                .orElseThrow(() -> new AppException("Không tìm thấy lớp học này", ErrorCode.CLASS_NOT_FOUND));

        // Đếm số học viên đã đăng ký trong lớp
        long count = enrollmentRepository.countByClassEntityClassId(classId);
        if (count >= cls.getMaxStudents()) {
            throw new AppException("Lớp này đã hết chỗ!", ErrorCode.SLOT_FULL);
        }

        // Tạo đối tượng ClassStudentEnrollment
        ClassStudentEnrollment cse = new ClassStudentEnrollment();
        cse.setClassEntity(cls);
        cse.setStudent(student);
        cse.setStatus(EnrollmentStatus.IN_PROGRESS);

        // Lưu ClassStudentEnrollment để lấy ID
        ClassStudentEnrollment savedCse = enrollmentRepository.save(cse);

        // Tạo TicketDTO cho enrollment này
        TicketDTO ticketDTO = new TicketDTO();
        ticketDTO.setTicketType(TicketType.STUDENT_TICKET);
        ticketDTO.setClassStudentEnrollmentId(savedCse.getClassStudentEnrollmentId());
        ticketDTO.setExpiryDate(cls.getEndDate().atStartOfDay());
        ticketDTO.setIssueDate(LocalDateTime.now());
        // Bạn có thể thêm các trường khác nếu cần thiết

        try {
            // Tạo Ticket bằng TicketService
            ticketService.createTicket(ticketDTO);
        } catch (Exception e) {
            throw new AppException("Không thể tạo vé cho enrollment: " + e.getMessage(), ErrorCode.UNKNOWN_ERROR);
        }
    }
}
