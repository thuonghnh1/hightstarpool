package edu.poly.hightstar.service.impl;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import edu.poly.hightstar.domain.ClassEntity;
import edu.poly.hightstar.domain.ClassSession;
import edu.poly.hightstar.domain.ClassStudentEnrollment;
import edu.poly.hightstar.domain.ClassTimeSlot;
import edu.poly.hightstar.domain.Course;
import edu.poly.hightstar.domain.Ticket;
import edu.poly.hightstar.domain.TimeSlot;
import edu.poly.hightstar.domain.Trainer;
import edu.poly.hightstar.domain.User;
import edu.poly.hightstar.domain.UserProfile;
import edu.poly.hightstar.enums.DayOfWeek;
import edu.poly.hightstar.model.ClassDTO;
import edu.poly.hightstar.model.ClassRequest;
import edu.poly.hightstar.model.StudentEnrollmentDTO;
import edu.poly.hightstar.model.TimeSlotDTO;
import edu.poly.hightstar.model.TrainerDTO;
import edu.poly.hightstar.repository.AttendanceRepository;
import edu.poly.hightstar.repository.ClassRepository;
import edu.poly.hightstar.repository.ClassSessionRepository;
import edu.poly.hightstar.repository.ClassStudentEnrollmentRepository;
import edu.poly.hightstar.repository.ClassTimeSlotRepository;
import edu.poly.hightstar.repository.CourseRepository;
import edu.poly.hightstar.repository.TicketRepository;
import edu.poly.hightstar.repository.TimeSlotRepository;
import edu.poly.hightstar.repository.TrainerRepository;
import edu.poly.hightstar.service.ClassService;
import edu.poly.hightstar.service.TrainerService;
import edu.poly.hightstar.utils.exception.AppException;
import edu.poly.hightstar.utils.exception.ErrorCode;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ClassServiceImpl implements ClassService {

    private final ClassRepository classRepository;
    private final ClassSessionRepository classSessionRepository;
    private final AttendanceRepository attendanceRepository;
    private final ClassStudentEnrollmentRepository classStudentEnrollmentRepository;
    private final CourseRepository courseRepository;
    private final TrainerRepository trainerRepository;
    private final TrainerService trainerService;
    private final TimeSlotRepository timeSlotRepository;
    private final ClassTimeSlotRepository classTimeSlotRepository;
    private final ClassStudentEnrollmentRepository enrollmentRepository;
    private final TicketRepository ticketRepository;

    @Override
    public List<StudentEnrollmentDTO> getEnrolledStudentsByClassId(Long classId) {
        // Lấy danh sách ClassStudentEnrollment từ DB
        List<ClassStudentEnrollment> enrollments = enrollmentRepository.findByClassEntityClassId(classId);

        // Chuyển sang DTO để trả về
        return enrollments.stream().map(enrollment -> {
            StudentEnrollmentDTO dto = new StudentEnrollmentDTO();
            dto.setStudentId(enrollment.getStudent().getStudentId());
            dto.setStudentName(enrollment.getStudent().getFullName());
            dto.setStatus(enrollment.getStatus());
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public List<ClassDTO> getAllClasses() {
        List<ClassEntity> classEntities = classRepository.findAll();
        List<ClassDTO> classDTOs = new ArrayList<>();

        for (ClassEntity classEntity : classEntities) {
            ClassDTO classDTO = mapToClassDTO(classEntity);
            classDTOs.add(classDTO);
        }
        return classDTOs;
    }

    @Override
    @Transactional
    public ClassDTO getClassById(Long classId) {
        ClassEntity classEntity = classRepository.findById(classId)
                .orElseThrow(() -> new AppException(
                        "Không tìm thấy lớp học với ID " + classId, ErrorCode.CLASS_NOT_FOUND));

        return mapToClassDTO(classEntity);
    }

    @Override
    @Transactional
    public List<TrainerDTO> getAvailableTrainersForNew(List<Long> selectedTimeSlotIds, LocalDate startDate) {
        // Lấy tất cả các HLV
        List<TrainerDTO> trainers = trainerService.getAllTrainers();
        // Lấy tất cả TimeSlot theo ID
        List<TimeSlot> selectedTimeSlots = timeSlotRepository.findAllById(selectedTimeSlotIds);
        // Lọc ra các HLV chưa có lớp học nào trong các khung giờ đã chọn
        List<TrainerDTO> availableTrainers = new ArrayList<>();

        for (TrainerDTO trainerDTO : trainers) {
            boolean isAvailable = true;

            // Kiểm tra từng khung giờ mà HLV đã tham gia vào lớp học
            for (TimeSlot timeSlot : selectedTimeSlots) {
                // Kiểm tra nếu khung giờ này đã được chọn trong lớp học của HLV
                boolean hasConflict = classRepository
                        .existsByTrainerTrainerIdAndClassTimeSlotsTimeSlot(trainerDTO.getTrainerId(), timeSlot);

                // Nếu có xung đột, kiểm tra thêm điều kiện về ngày bắt đầu và ngày kết thúc
                if (hasConflict) {
                    List<ClassEntity> conflictingClasses = classRepository
                            .findByTrainerTrainerIdAndClassTimeSlotsTimeSlot(trainerDTO.getTrainerId(), timeSlot);

                    for (ClassEntity conflictingClass : conflictingClasses) {
                        LocalDate conflictingEndDate = conflictingClass.getEndDate();

                        // Nếu ngày bắt đầu của lớp mới lớn hơn ngày kết thúc của lớp cũ, không coi là
                        // xung đột
                        if (startDate.isAfter(conflictingEndDate)) {
                            hasConflict = false;
                            break;
                        }
                    }
                }

                // Nếu vẫn còn xung đột, đánh dấu không khả dụng và thoát vòng lặp
                if (hasConflict) {
                    isAvailable = false;
                    break;
                }
            }

            if (isAvailable) {
                availableTrainers.add(trainerDTO);
            }
        }

        return availableTrainers;
    }

    @Override
    @Transactional
    public List<TrainerDTO> getAvailableTrainersForUpdate(List<Long> selectedTimeSlotIds, Long classId,
            LocalDate startDate) {
        // Lấy tất cả các HLV
        List<TrainerDTO> trainers = trainerService.getAllTrainers();
        // Lấy tất cả TimeSlot theo ID
        List<TimeSlot> selectedTimeSlots = timeSlotRepository.findAllById(selectedTimeSlotIds);
        // Lọc ra các HLV chưa có lớp học nào trong các khung giờ đã chọn
        List<TrainerDTO> availableTrainers = new ArrayList<>();

        for (TrainerDTO trainerDTO : trainers) {
            boolean isAvailable = true;

            // Kiểm tra từng khung giờ mà HLV đã tham gia vào lớp học
            for (TimeSlot timeSlot : selectedTimeSlots) {
                // Kiểm tra nếu khung giờ này đã được chọn trong lớp học của HLV
                boolean hasConflict = classRepository
                        .existsByTrainerTrainerIdAndClassTimeSlotsTimeSlot(trainerDTO.getTrainerId(), timeSlot);

                // Nếu đang chỉnh sửa, bỏ qua kiểm tra xung đột cho HLV hiện tại
                if (classId != null
                        && classRepository.existsByClassIdAndTrainerTrainerId(classId, trainerDTO.getTrainerId())) {
                    hasConflict = false;
                }

                // Nếu có xung đột, kiểm tra thêm điều kiện về ngày bắt đầu và ngày kết thúc
                if (hasConflict) {
                    List<ClassEntity> conflictingClasses = classRepository
                            .findByTrainerTrainerIdAndClassTimeSlotsTimeSlot(trainerDTO.getTrainerId(), timeSlot);

                    for (ClassEntity conflictingClass : conflictingClasses) {
                        LocalDate conflictingEndDate = conflictingClass.getEndDate();

                        // Nếu ngày bắt đầu của lớp mới lớn hơn ngày kết thúc của lớp cũ, không coi là
                        // xung đột
                        if (startDate.isAfter(conflictingEndDate)) {
                            hasConflict = false;
                            break;
                        }
                    }
                }

                // Nếu vẫn còn xung đột, đánh dấu không khả dụng và thoát vòng lặp
                if (hasConflict) {
                    isAvailable = false;
                    break;
                }
            }

            if (isAvailable) {
                availableTrainers.add(trainerDTO);
            }
        }

        return availableTrainers;
    }

    @Override
    @Transactional
    public List<ClassDTO> getAvailableClassesForCourse(Long courseId) {
        // Lấy ngày hiện tại
        LocalDate today = LocalDate.now();

        // Lọc ra các lớp học thuộc khóa học được chỉ định và có ngày bắt đầu sau ngày
        // hiện tại
        List<ClassDTO> availableClasses = classRepository.findAll().stream()
                .filter(cls -> cls.getCourse().getCourseId().equals(courseId)) // Lọc theo khóa học
                .filter(cls -> cls.getStartDate().isAfter(today)) // Chỉ lấy lớp chưa bắt đầu
                .map(this::mapToClassDTO)
                .collect(Collectors.toList());
        return availableClasses;
    }

    @Override
    @Transactional
    public ClassDTO createClass(ClassRequest request) {
        // Kiểm tra và lấy Course
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new AppException("Không tìm thấy khóa học này!", ErrorCode.COURSE_NOT_FOUND));

        // Kiểm tra và lấy Trainer
        Trainer trainer = trainerRepository.findById(request.getTrainerId())
                .orElseThrow(() -> new AppException("Không tìm thấy HLV này!", ErrorCode.TRAINER_NOT_FOUND));

        // fix lỗi vòng lặp vô hạn (do lỗi tuần tự khi lấy user trong trainer)
        Trainer trainerCustom = new Trainer();
        trainerCustom.setTrainerId(trainer.getTrainerId());
        User user = new User();
        UserProfile userProfile = new UserProfile();
        userProfile.setFullName(trainer.getUser().getUserProfile().getFullName());
        user.setUserProfile(userProfile);
        trainerCustom.setUser(user);

        // Tạo và lưu ClassEntity
        ClassEntity cl = new ClassEntity();
        cl.setCourse(course);
        cl.setTrainer(trainerCustom);
        cl.setStartDate(request.getStartDate());
        cl.setEndDate(request.getEndDate());
        cl.setMaxStudents(request.getMaxStudents());
        classRepository.save(cl);

        // Lấy và kiểm tra TimeSlots
        List<TimeSlot> slots = timeSlotRepository.findAllById(request.getTimeSlotIds());
        if (slots.size() != request.getTimeSlotIds().size()) {
            throw new AppException("Một hoặc nhiều TimeSlot không tồn tại!", ErrorCode.TIMESLOT_NOT_FOUND);
        }

        // Lưu ClassTimeSlots
        List<ClassTimeSlot> classTimeSlots = slots.stream()
                .map(slot -> {
                    ClassTimeSlot cts = new ClassTimeSlot();
                    cts.setClassEntity(cl);
                    cts.setTimeSlot(slot);
                    return cts;
                })
                .collect(Collectors.toList());
        classTimeSlotRepository.saveAll(classTimeSlots);
        cl.getClassTimeSlots().addAll(classTimeSlots);

        // Tạo và lưu ClassSession
        List<ClassSession> sessions = generateSessions(cl, slots);
        if (sessions.isEmpty()) {
            throw new AppException("Không thể tạo phiên học cho lớp này!", ErrorCode.SESSION_GENERATION_FAILED);
        }
        cl.setNumberOfSessions(sessions.size());
        classRepository.save(cl);
        // Trả về DTO
        return mapToClassDTO(cl);
    }

    @Override
    @Transactional
    public ClassDTO updateClass(Long classId, ClassRequest request) {
        ClassEntity classEntity = classRepository.findById(classId)
                .orElseThrow(() -> new AppException("Không tìm thấy lớp học này!", ErrorCode.CLASS_NOT_FOUND));

        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new AppException("Không tìm thấy khóa học này!", ErrorCode.COURSE_NOT_FOUND));

        Trainer trainer = trainerRepository.findById(request.getTrainerId())
                .orElseThrow(() -> new AppException("Không tìm thấy HLV này!", ErrorCode.TRAINER_NOT_FOUND));

        // Cập nhật thông tin lớp học
        classEntity.setCourse(course);
        classEntity.setTrainer(trainer);
        classEntity.setStartDate(request.getStartDate());
        classEntity.setEndDate(request.getEndDate());
        classEntity.setMaxStudents(request.getMaxStudents());

        // Cập nhật TimeSlot
        classTimeSlotRepository.deleteAll(classEntity.getClassTimeSlots());
        classEntity.getClassTimeSlots().clear();

        List<TimeSlot> slots = timeSlotRepository.findAllById(request.getTimeSlotIds());
        for (TimeSlot slot : slots) {
            ClassTimeSlot cts = new ClassTimeSlot();
            cts.setClassEntity(classEntity);
            cts.setTimeSlot(slot);
            classTimeSlotRepository.save(cts);
            classEntity.getClassTimeSlots().add(cts);
        }

        // Cập nhật ClassSession
        classSessionRepository.deleteAllByClassEntity(classEntity);
        List<ClassSession> sessions = generateSessions(classEntity, slots);
        classEntity.setNumberOfSessions(sessions.size());

        // Đồng bộ vé dựa trên thay đổi ngày của lớp học
        syncTicketsWithClassDates(classEntity);

        classRepository.save(classEntity);

        return mapToClassDTO(classEntity);
    }

    @Override
    @Transactional
    public void deleteClassById(Long classId) {
        ClassEntity classEntity = classRepository.findById(classId)
                .orElseThrow(
                        () -> new AppException("Không tìm thấy lớp học với ID " + classId, ErrorCode.CLASS_NOT_FOUND));

        // Lấy danh sách các buổi học liên quan
        List<ClassSession> sessions = classSessionRepository.findByClassEntityClassId(classEntity.getClassId());

        // Xóa Attendance nếu cần
        attendanceRepository.deleteAllByClassSessionIn(sessions);

        // Xóa các buổi học liên quan
        classSessionRepository.deleteAllByClassEntity(classEntity);

        // Xóa các TimeSlot liên quan
        classTimeSlotRepository.deleteAllByClassEntity(classEntity);

        // Xóa ClassStudentEnrollment nếu cần
        classStudentEnrollmentRepository.deleteAllByClassEntity(classEntity);

        // Xóa lớp học
        classRepository.delete(classEntity);
    }

    @Transactional
    private List<ClassSession> generateSessions(ClassEntity cls, List<TimeSlot> slots) {
        // Tập hợp dayOfWeek từ TimeSlot (từ enum tự định nghĩa sang
        // java.time.DayOfWeek)
        Set<java.time.DayOfWeek> teachingDays = new HashSet<>();
        for (TimeSlot slot : slots) {

            DayOfWeek customDay = slot.getDayOfWeek();
            java.time.DayOfWeek javaDay = java.time.DayOfWeek.valueOf(customDay.name());
            teachingDays.add(javaDay);
        }

        List<ClassSession> sessions = new ArrayList<>();
        // Bắt đầu từ ngày startDate
        LocalDate current = cls.getStartDate();

        // Duyệt qua mỗi ngày từ startDate đến endDate
        while (!current.isAfter(cls.getEndDate())) {
            // Kiểm tra nếu (thứ) của ngày hiện tại có trong các (thứ) dạy trong tuần
            if (teachingDays.contains(current.getDayOfWeek())) {
                // Nếu có, nghĩa là hôm đó có buổi học
                ClassSession cs = new ClassSession();
                cs.setClassEntity(cls);
                cs.setSessionDate(current);
                classSessionRepository.save(cs);
                sessions.add(cs);
            }
            // Chuyển sang ngày tiếp theo
            current = current.plusDays(1);
        }
        // Trả về danh sách tất cả các buổi học
        return sessions;
    }

    // Tính toán trạng thái của lớp học.
    private String calculateStatus(ClassEntity classEntity) {
        LocalDate today = LocalDate.now();
        if (today.isBefore(classEntity.getStartDate())) {
            return "NOT_STARTED";
        } else if (today.isAfter(classEntity.getEndDate())) {
            return "COMPLETED";
        } else {
            return "IN_PROGRESS";
        }
    }

    private int calculateProgress(ClassEntity classEntity, List<ClassSession> sessions) {
        String status = calculateStatus(classEntity); // Lấy trạng thái của lớp học

        if ("COMPLETED".equals(status)) {
            return 100; // Nếu lớp đã hoàn thành, hiển thị tiến trình là 100%
        }

        if (!"IN_PROGRESS".equals(status)) {
            return 0; // Nếu lớp chưa bắt đầu, tiến trình là 0%
        }

        long completedSessions = sessions.stream()
                .filter(session -> !session.getSessionDate().isAfter(LocalDate.now())) // Lọc các buổi đã hoàn thành
                .count();

        return (int) ((completedSessions * 100) / classEntity.getNumberOfSessions());
    }

    @Transactional
    private ClassDTO mapToClassDTO(ClassEntity classEntity) {
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

        // Tính trạng thái và tiến trình
        List<ClassSession> sessions = classSessionRepository.findByClassEntityClassId(classEntity.getClassId());
        classDTO.setStatus(calculateStatus(classEntity));
        classDTO.setProgress(calculateProgress(classEntity, sessions));

        return classDTO;
    }

    private void syncTicketsWithClassDates(ClassEntity classEntity) {
        // Tìm tất cả các đăng ký liên quan đến lớp học
        List<ClassStudentEnrollment> enrollments = enrollmentRepository
                .findByClassEntityClassId(classEntity.getClassId());

        for (ClassStudentEnrollment enrollment : enrollments) {
            // Tìm tất cả vé liên quan đến đăng ký này
            List<Ticket> tickets = ticketRepository.findByClassStudentEnrollment(enrollment);

            for (Ticket ticket : tickets) {
                // Cập nhật ngày bắt đầu và kết thúc của vé
                ticket.setIssueDate(classEntity.getStartDate().atStartOfDay());
                ticket.setExpiryDate(classEntity.getEndDate().atStartOfDay());

                // Lưu vé đã cập nhật
                ticketRepository.save(ticket);
            }
        }
    }

}
