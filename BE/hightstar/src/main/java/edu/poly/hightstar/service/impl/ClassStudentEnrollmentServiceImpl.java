package edu.poly.hightstar.service.impl;

import edu.poly.hightstar.domain.ClassEntity;
import edu.poly.hightstar.domain.ClassStudentEnrollment;
import edu.poly.hightstar.domain.Student;
import edu.poly.hightstar.domain.TimeSlot;
import edu.poly.hightstar.enums.EnrollmentStatus;
import edu.poly.hightstar.enums.TicketType;
import edu.poly.hightstar.model.ClassDTO;
import edu.poly.hightstar.model.ClassStudentEnrollmentDTO;
import edu.poly.hightstar.model.StudentDTO;
import edu.poly.hightstar.model.TicketDTO;
import edu.poly.hightstar.model.TimeSlotDTO;
import edu.poly.hightstar.repository.ClassRepository;
import edu.poly.hightstar.repository.ClassStudentEnrollmentRepository;
import edu.poly.hightstar.repository.StudentRepository;
import edu.poly.hightstar.repository.TicketRepository;
import edu.poly.hightstar.service.ClassStudentEnrollmentService;
import edu.poly.hightstar.service.TicketService;
import edu.poly.hightstar.utils.exception.AppException;
import edu.poly.hightstar.utils.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClassStudentEnrollmentServiceImpl implements ClassStudentEnrollmentService {
    private final ClassStudentEnrollmentRepository enrollmentRepository;
    private final ClassRepository classRepository;
    private final StudentRepository studentRepository;
    private final TicketService ticketService;
    private final TicketRepository ticketRepository;

    @Override
    @Transactional
    public List<ClassStudentEnrollmentDTO> getAllEnrollments() {
        LocalDate today = LocalDate.now();

        // Lấy tất cả các enrollments
        List<ClassStudentEnrollment> enrollments = enrollmentRepository.findAll();

        // Duyệt qua từng enrollment và kiểm tra trạng thái
        for (ClassStudentEnrollment enrollment : enrollments) {
            if (enrollment.getStatus() == EnrollmentStatus.WITHDRAWN) {
                continue; // Không cập nhật nếu trạng thái là WITHDRAWN
            }

            LocalDate classStartDate = enrollment.getClassEntity().getStartDate();
            LocalDate classEndDate = enrollment.getClassEntity().getEndDate();

            if (classStartDate.isAfter(today) && enrollment.getStatus() != EnrollmentStatus.NOT_STARTED) {
                enrollment.setStatus(EnrollmentStatus.NOT_STARTED);
                enrollmentRepository.save(enrollment);
            } else if (classEndDate.isBefore(today) && enrollment.getStatus() == EnrollmentStatus.IN_PROGRESS) {
                enrollment.setStatus(EnrollmentStatus.COMPLETED);
                enrollmentRepository.save(enrollment);
            } else if (classStartDate.isBefore(today) && classEndDate.isAfter(today)
                    && enrollment.getStatus() != EnrollmentStatus.IN_PROGRESS) {
                enrollment.setStatus(EnrollmentStatus.IN_PROGRESS);
                enrollmentRepository.save(enrollment);
            }
        }

        // Chuyển đổi danh sách sang DTO và trả về
        return enrollments.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public List<ClassDTO> getAvailableClassesForStudent(Long enrollmentId) {
        // Lấy ngày hiện tại
        LocalDate today = LocalDate.now();

        // Tìm lớp hiện tại (nếu đang ở chế độ chỉnh sửa)
        ClassEntity currentClass = null;
        if (enrollmentId != null) {
            ClassStudentEnrollment enrollment = enrollmentRepository.findById(enrollmentId)
                    .orElseThrow(() -> new AppException("Không tìm thấy đăng ký", ErrorCode.ENROLLMENT_NOT_FOUND));
            currentClass = enrollment.getClassEntity();
        }

        // Lọc ra các lớp học có ngày bắt đầu sau ngày hiện tại
        List<ClassDTO> availableClasses = classRepository.findAll().stream()
                .filter(cls -> cls.getStartDate().isAfter(today)) // Chỉ lấy lớp chưa bắt đầu
                .map(this::convertToClassDTO)
                .collect(Collectors.toList());

        // Nếu có lớp hiện tại và nó không nằm trong danh sách, thêm vào
        if (currentClass != null) {
            ClassDTO currentClassDTO = convertToClassDTO(currentClass);
            if (!availableClasses.contains(currentClassDTO)) {
                availableClasses.add(currentClassDTO);
            }
        }

        return availableClasses;
    }

    @Override
    public ClassStudentEnrollmentDTO getEnrollmentById(Long id) {
        ClassStudentEnrollment enrollment = enrollmentRepository.findById(id)
                .orElseThrow(() -> new AppException("Không tìm thấy đăng ký", ErrorCode.ENROLLMENT_NOT_FOUND));
        return convertToDTO(enrollment);
    }

    @Override
    @Transactional
    public ClassStudentEnrollmentDTO createEnrollment(ClassStudentEnrollmentDTO dto) {
        // Kiểm tra xem học viên đã có lớp nào đang học chưa
        boolean hasActiveEnrollment = enrollmentRepository.existsByStudentStudentIdAndStatus(
                dto.getStudentId(), EnrollmentStatus.IN_PROGRESS);

        if (hasActiveEnrollment) {
            throw new AppException("Học viên này đã tồn tại trong một lớp khác!", ErrorCode.CONFLICT_ERROR);
        }

        // Tìm lớp học
        ClassEntity cls = classRepository.findById(dto.getClassId())
                .orElseThrow(() -> new AppException("Lớp học không tồn tại", ErrorCode.CLASS_NOT_FOUND));

        // Tìm học viên
        Student student = studentRepository.findById(dto.getStudentId())
                .orElseThrow(() -> new AppException("Học viên không tồn tại", ErrorCode.STUDENT_NOT_FOUND));

        // Tạo bản ghi mới
        ClassStudentEnrollment enrollment = new ClassStudentEnrollment();
        enrollment.setClassEntity(cls);
        enrollment.setStudent(student);

        // Tính toán trạng thái ban đầu
        LocalDate today = LocalDate.now();
        if (cls.getStartDate().isAfter(today)) {
            enrollment.setStatus(EnrollmentStatus.NOT_STARTED);
        } else if (cls.getEndDate().isBefore(today)) {
            enrollment.setStatus(EnrollmentStatus.COMPLETED);
        } else {
            enrollment.setStatus(EnrollmentStatus.IN_PROGRESS);
        }

        // Lưu vào DB
        ClassStudentEnrollment classStudentEnrollment = enrollmentRepository.save(enrollment);

        // Tạo TicketDTO cho enrollment này
        TicketDTO ticketDTO = new TicketDTO();
        ticketDTO.setTicketType(TicketType.STUDENT_TICKET);
        ticketDTO.setClassStudentEnrollmentId(classStudentEnrollment.getClassStudentEnrollmentId());
        ticketDTO.setExpiryDate(cls.getEndDate().atStartOfDay());
        ticketDTO.setIssueDate(cls.getStartDate().atStartOfDay());
        // Bạn có thể thêm các trường khác nếu cần thiết

        try {
            // Tạo Ticket bằng TicketService
            ticketService.createTicket(ticketDTO);
        } catch (Exception e) {
            throw new AppException("Không thể tạo vé cho enrollment: " + e.getMessage(), ErrorCode.UNKNOWN_ERROR);
        }

        return convertToDTO(enrollment);
    }

    @Override
    @Transactional
    public ClassStudentEnrollmentDTO updateEnrollment(Long id, ClassStudentEnrollmentDTO dto) {
        ClassStudentEnrollment enrollment = enrollmentRepository.findById(id)
                .orElseThrow(() -> new AppException("Không tìm thấy đăng ký", ErrorCode.ENROLLMENT_NOT_FOUND));

        if (dto.getClassId() != null) {
            ClassEntity cls = classRepository.findById(dto.getClassId())
                    .orElseThrow(() -> new AppException("Lớp học không tồn tại", ErrorCode.CLASS_NOT_FOUND));
            enrollment.setClassEntity(cls);
        }
        if (dto.getStudentId() != null) {
            Student student = studentRepository.findById(dto.getStudentId())
                    .orElseThrow(() -> new AppException("Học viên không tồn tại", ErrorCode.STUDENT_NOT_FOUND));
            enrollment.setStudent(student);
        }
        if (dto.getStatus() != null) {
            enrollment.setStatus(dto.getStatus());
        }

        enrollmentRepository.save(enrollment);
        return convertToDTO(enrollment);
    }

    @Override
    @Transactional
    public void deleteEnrollment(Long id) {
        ClassStudentEnrollment enrollment = enrollmentRepository.findById(id)
                .orElseThrow(() -> new AppException("Không tìm thấy đăng ký", ErrorCode.ENROLLMENT_NOT_FOUND));

        // Xóa các bản ghi liên quan trong bảng tickets
        ticketRepository.deleteByClassStudentEnrollmentId(id);

        // Xóa bản ghi trong class_student_enrollments
        enrollmentRepository.delete(enrollment);
    }

    // Chuyển đổi ClassStudentEnrollment sang DTO
    private ClassStudentEnrollmentDTO convertToDTO(ClassStudentEnrollment enrollment) {
        ClassStudentEnrollmentDTO dto = new ClassStudentEnrollmentDTO();
        dto.setEnrollmentId(enrollment.getClassStudentEnrollmentId());
        dto.setClassId(enrollment.getClassEntity().getClassId());
        dto.setCourseName(enrollment.getClassEntity().getCourse().getCourseName());
        dto.setStudentId(enrollment.getStudent().getStudentId());
        dto.setStudentName(enrollment.getStudent().getFullName());
        dto.setStatus(enrollment.getStatus());

        // Lấy danh sách lịch học (TimeSlot)
        List<TimeSlotDTO> timeSlots = enrollment.getClassEntity().getClassTimeSlots().stream()
                .map(classTimeSlot -> {
                    TimeSlot timeSlot = classTimeSlot.getTimeSlot();
                    return new TimeSlotDTO(
                            timeSlot.getSlotId(),
                            timeSlot.getDayOfWeek(),
                            timeSlot.getStartTime(),
                            timeSlot.getEndTime());
                })
                .collect(Collectors.toList());
        dto.setTimeSlots(timeSlots);

        return dto;
    }

    // Chuyển đổi ClassEntity sang ClassDTO
    private ClassDTO convertToClassDTO(ClassEntity classEntity) {
        ClassDTO classDTO = new ClassDTO();
        classDTO.setClassId(classEntity.getClassId());
        classDTO.setCourseName(classEntity.getCourse().getCourseName());
        classDTO.setCourseId(classEntity.getCourse().getCourseId());
        classDTO.setTrainerName(classEntity.getTrainer().getUser().getUserProfile().getFullName());
        classDTO.setTrainerId(classEntity.getTrainer().getTrainerId());
        classDTO.setStartDate(classEntity.getStartDate());
        classDTO.setEndDate(classEntity.getEndDate());
        classDTO.setMaxStudents(classEntity.getMaxStudents());
        classDTO.setNumberOfSessions(classEntity.getNumberOfSessions());
        return classDTO;
    }

    @Override
    @Transactional
    public List<StudentDTO> getStudentsNotEnrolledInAnyClass() {
        List<Student> students = studentRepository.findStudentsNotEnrolledInAnyClass();
        return students.stream()
                .map(this::convertToStudentDTO)
                .collect(Collectors.toList());
    }

    // Phương thức chuyển đổi Student sang StudentDTO
    private StudentDTO convertToStudentDTO(Student student) {
        StudentDTO dto = new StudentDTO();
        dto.setStudentId(student.getStudentId());
        dto.setFullName(student.getFullName());
        dto.setAge(student.getAge());
        dto.setGender(student.getGender());
        dto.setNote(student.getNote());
        return dto;
    }
}
