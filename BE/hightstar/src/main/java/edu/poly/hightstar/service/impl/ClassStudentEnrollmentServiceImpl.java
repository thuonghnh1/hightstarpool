package edu.poly.hightstar.service.impl;

import edu.poly.hightstar.domain.ClassEntity;
import edu.poly.hightstar.domain.ClassStudentEnrollment;
import edu.poly.hightstar.domain.ClassTimeSlot;
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
import java.util.ArrayList;
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
            } else if (classStartDate.isEqual(today) ||
                    (classStartDate.isBefore(today) && classEndDate.isAfter(today))) {
                // Xử lý trạng thái IN_PROGRESS
                if (enrollment.getStatus() != EnrollmentStatus.IN_PROGRESS) {
                    enrollment.setStatus(EnrollmentStatus.IN_PROGRESS);
                    enrollmentRepository.save(enrollment);
                }
            } else if (classEndDate.isBefore(today) && enrollment.getStatus() == EnrollmentStatus.IN_PROGRESS) {
                enrollment.setStatus(EnrollmentStatus.COMPLETED);
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
    public List<ClassDTO> getAvailableClassesForStudent(Long studentId, Long enrollmentId) {
        // Lấy ngày hiện tại
        LocalDate today = LocalDate.now();
        System.out.println("Today: " + today);

        // Lấy danh sách các lớp mà học viên đã đăng ký
        List<ClassStudentEnrollment> studentEnrollments = enrollmentRepository.findByStudentStudentId(studentId);
        System.out.println("Student Enrollments: " + studentEnrollments.size());

        // Lấy ngày kết thúc muộn nhất từ danh sách các lớp đã đăng ký
        LocalDate latestEndDate = studentEnrollments.stream()
                .map(enrollment -> enrollment.getClassEntity().getEndDate())
                .max(LocalDate::compareTo)
                .orElse(today); // Nếu học viên chưa đăng ký lớp nào, mặc định là ngày hiện tại
        System.out.println("Latest End Date: " + latestEndDate);

        // Lấy tất cả các lớp học từ cơ sở dữ liệu
        List<ClassEntity> allClasses = classRepository.findAll();
        System.out.println("All Classes: " + allClasses.size());

        // Lấy lớp hiện tại (nếu đang cập nhật)
        ClassEntity currentClass = null;
        if (enrollmentId != null) {
            ClassStudentEnrollment enrollment = enrollmentRepository.findById(enrollmentId)
                    .orElseThrow(() -> new AppException("Không tìm thấy đăng ký", ErrorCode.ENROLLMENT_NOT_FOUND));
            currentClass = enrollment.getClassEntity();
            System.out.println("Current Class: " + currentClass.getClassId());
        }

        // Lọc ra các lớp mà học viên chưa đăng ký, có ngày bắt đầu sau ngày kết thúc
        // muộn nhất và chưa bắt đầu
        List<ClassDTO> availableClasses = allClasses.stream()
                .filter(cls -> {
                    // Kiểm tra lớp chưa đăng ký
                    boolean notEnrolled = studentEnrollments.stream()
                            .noneMatch(enrollment -> enrollment.getClassEntity().getClassId().equals(cls.getClassId()));
                    System.out.println("Class ID: " + cls.getClassId() + ", Not Enrolled: " + notEnrolled);

                    // Kiểm tra ngày bắt đầu hợp lệ
                    boolean validStartDate = !cls.getStartDate().isBefore(latestEndDate.plusDays(1))
                            && cls.getStartDate().isAfter(today);
                    System.out.println("Class ID: " + cls.getClassId() + ", Valid Start Date: " + validStartDate);

                    return notEnrolled && validStartDate;
                })
                .map(this::convertToClassDTO) // Chuyển đổi sang DTO
                .collect(Collectors.toList());

        // Thêm lớp hiện tại vào danh sách nếu đang cập nhật và nó không thỏa mãn điều
        // kiện lọc
        if (currentClass != null) {
            ClassDTO currentClassDTO = convertToClassDTO(currentClass);
            if (!availableClasses.contains(currentClassDTO)) {
                availableClasses.add(currentClassDTO);
                System.out.println("Added Current Class: " + currentClass.getClassId());
            }
        }

        System.out.println("Available Classes: " + availableClasses.size());
        return availableClasses;
    }

    @Override
    public ClassStudentEnrollmentDTO getEnrollmentById(Long id) {
        ClassStudentEnrollment enrollment = enrollmentRepository.findById(id)
                .orElseThrow(() -> new AppException("Không tìm thấy đăng ký", ErrorCode.ENROLLMENT_NOT_FOUND));
        return convertToDTO(enrollment, null);
    }

    @Override
    @Transactional
    public ClassStudentEnrollmentDTO createEnrollment(ClassStudentEnrollmentDTO dto) {
        // Kiểm tra xem học viên đã tồn tại trong lớp học này chưa
        boolean alreadyEnrolled = enrollmentRepository.existsByStudentStudentIdAndClassEntityClassId(
                dto.getStudentId(), dto.getClassId());

        if (alreadyEnrolled) {
            throw new AppException("Học viên này đã đăng ký vào lớp học này!", ErrorCode.CONFLICT_ERROR);
        }

        // Tìm lớp học
        ClassEntity cls = classRepository.findById(dto.getClassId())
                .orElseThrow(() -> new AppException("Lớp học không tồn tại", ErrorCode.CLASS_NOT_FOUND));

        // Tìm học viên
        Student student = studentRepository.findById(dto.getStudentId())
                .orElseThrow(() -> new AppException("Học viên không tồn tại", ErrorCode.STUDENT_NOT_FOUND));

        // Kiểm tra tất cả các lớp học đã đăng ký (bao gồm NOT_STARTED và IN_PROGRESS)
        List<ClassStudentEnrollment> existingEnrollments = enrollmentRepository
                .findByStudentStudentId(dto.getStudentId());

        for (ClassStudentEnrollment existingEnrollment : existingEnrollments) {
            LocalDate existingEndDate = existingEnrollment.getClassEntity().getEndDate();
            LocalDate existingStartDate = existingEnrollment.getClassEntity().getStartDate();
            LocalDate newStartDate = cls.getStartDate();

            // Kiểm tra xem lớp mới có chồng lấn thời gian với lớp hiện tại hoặc trong tương
            // lai không
            if (!newStartDate.isAfter(existingEndDate) && !newStartDate.isBefore(existingStartDate)) {
                throw new AppException(
                        "Thời gian bắt đầu của lớp này bị chồng lên một lớp khác mà học viên đã đăng ký!",
                        ErrorCode.CONFLICT_ERROR);
            }
        }

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

        TicketDTO createTicketDTO = null;
        try {
            // Tạo Ticket bằng TicketService
            createTicketDTO = ticketService.createTicket(ticketDTO);
        } catch (Exception e) {
            throw new AppException("Không thể tạo vé cho enrollment: " + e.getMessage(), ErrorCode.UNKNOWN_ERROR);
        }

        return convertToDTO(enrollment, createTicketDTO);
    }

    @Override
    @Transactional
    public ClassStudentEnrollmentDTO updateEnrollment(Long id, ClassStudentEnrollmentDTO dto) {
        // Lấy thông tin đăng ký hiện tại
        ClassStudentEnrollment enrollment = enrollmentRepository.findById(id)
                .orElseThrow(() -> new AppException("Không tìm thấy đăng ký", ErrorCode.ENROLLMENT_NOT_FOUND));

        // Kiểm tra nếu thay đổi lớp học
        if (dto.getClassId() != null && !dto.getClassId().equals(enrollment.getClassEntity().getClassId())) {
            // Lấy lớp học mới
            ClassEntity newClass = classRepository.findById(dto.getClassId())
                    .orElseThrow(() -> new AppException("Lớp học không tồn tại", ErrorCode.CLASS_NOT_FOUND));

            // Lấy danh sách tất cả các lớp học mà học viên đã đăng ký (trừ lớp hiện tại)
            List<ClassStudentEnrollment> existingEnrollments = enrollmentRepository
                    .findByStudentStudentId(dto.getStudentId())
                    .stream()
                    .filter(e -> !e.getClassEntity().getClassId().equals(enrollment.getClassEntity().getClassId()))
                    .collect(Collectors.toList());

            // Kiểm tra xung đột thời gian với các lớp học khác
            for (ClassStudentEnrollment existingEnrollment : existingEnrollments) {
                LocalDate existingEndDate = existingEnrollment.getClassEntity().getEndDate();
                LocalDate existingStartDate = existingEnrollment.getClassEntity().getStartDate();
                LocalDate newStartDate = newClass.getStartDate();

                if (!newStartDate.isAfter(existingEndDate) && !newStartDate.isBefore(existingStartDate)) {
                    throw new AppException(
                            "Thời gian bắt đầu của lớp này bị chồng lên một lớp khác mà học viên đã đăng ký!",
                            ErrorCode.CONFLICT_ERROR);
                }
            }

            // Cập nhật lớp học mới
            enrollment.setClassEntity(newClass);
        }

        // Cập nhật thông tin học viên nếu cần
        if (dto.getStudentId() != null && !dto.getStudentId().equals(enrollment.getStudent().getStudentId())) {
            Student student = studentRepository.findById(dto.getStudentId())
                    .orElseThrow(() -> new AppException("Học viên không tồn tại", ErrorCode.STUDENT_NOT_FOUND));
            enrollment.setStudent(student);
        }

        // Cập nhật trạng thái nếu có thay đổi
        if (dto.getStatus() != null) {
            enrollment.setStatus(dto.getStatus());
        }

        enrollmentRepository.save(enrollment);
        return convertToDTO(enrollment, null);
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

    // Chuyển đổi ClassStudentEnrollment sang DTO (dùng cho việc hiển thị danh sách)
    private ClassStudentEnrollmentDTO convertToDTO(ClassStudentEnrollment enrollment) {
        return convertToDTO(enrollment, null);
    }

    // Chuyển đổi ClassStudentEnrollment sang DTO
    private ClassStudentEnrollmentDTO convertToDTO(ClassStudentEnrollment enrollment, TicketDTO ticketDto) {
        ClassStudentEnrollmentDTO dto = new ClassStudentEnrollmentDTO();
        dto.setEnrollmentId(enrollment.getClassStudentEnrollmentId());
        dto.setClassId(enrollment.getClassEntity().getClassId());
        dto.setCourseName(enrollment.getClassEntity().getCourse().getCourseName());
        dto.setStudentId(enrollment.getStudent().getStudentId());
        dto.setStudentName(enrollment.getStudent().getFullName());
        dto.setStatus(enrollment.getStatus());
        dto.setTicket(ticketDto);

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

    @Transactional
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

        // Lấy danh sách TimeSlot
        List<TimeSlotDTO> timeSlotDTOs = new ArrayList<>();
        for (ClassTimeSlot classTimeSlot : classEntity.getClassTimeSlots()) {
            TimeSlot timeSlot = classTimeSlot.getTimeSlot();

            TimeSlotDTO timeSlotDTO = new TimeSlotDTO();
            timeSlotDTO.setSlotId(timeSlot.getSlotId());
            timeSlotDTO.setDayOfWeek(timeSlot.getDayOfWeek());
            timeSlotDTO.setStartTime(timeSlot.getStartTime());
            timeSlotDTO.setEndTime(timeSlot.getEndTime());
            timeSlotDTOs.add(timeSlotDTO);
        }
        classDTO.setTimeSlots(timeSlotDTOs);

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
