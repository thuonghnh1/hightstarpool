package edu.poly.hightstar.service.impl;

import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.poly.hightstar.repository.TicketRepository;
import edu.poly.hightstar.repository.AttendanceRepository;
import edu.poly.hightstar.repository.ClassStudentEnrollmentRepository;
import edu.poly.hightstar.repository.OrderDetailRepository;
import edu.poly.hightstar.repository.TicketPriceRepository;
import edu.poly.hightstar.domain.Attendance;
import edu.poly.hightstar.domain.ClassStudentEnrollment;
import edu.poly.hightstar.domain.Ticket;
import edu.poly.hightstar.domain.TicketPrice;
import edu.poly.hightstar.enums.TicketType;
import edu.poly.hightstar.model.TicketDTO;
import edu.poly.hightstar.service.TicketCodeService;
import edu.poly.hightstar.service.TicketService;
import edu.poly.hightstar.utils.exception.AppException;
import edu.poly.hightstar.utils.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import com.google.zxing.WriterException;
import java.io.IOException;

import edu.poly.hightstar.utils.qr.QRCodeGenerator;

@Service
@RequiredArgsConstructor
public class TicketServiceImpl implements TicketService {
    private final TicketRepository ticketRepository;
    private final TicketPriceRepository ticketPriceRepository;
    private final TicketCodeService ticketCodeService;
    private final AttendanceRepository attendanceRepository;
    private final QRCodeGenerator qrCodeGenerator;
    private final OrderDetailRepository orderDetailRepository;
    private final ClassStudentEnrollmentRepository classStudentEnrollmentRepository;

    Date today = getCurrentDateWithoutTime();

    @Override
    @Transactional
    public List<TicketDTO> getAllTickets() {
        return ticketRepository.findAll().stream().map(ticket -> {
            TicketDTO dto = new TicketDTO();
            BeanUtils.copyProperties(ticket, dto);

            // Lấy classStudentEnrollmentId từ entity nếu có
            if (ticket.getClassStudentEnrollment() != null) {
                dto.setClassStudentEnrollmentId(ticket.getClassStudentEnrollment().getClassStudentEnrollmentId());
            } else {
                dto.setClassStudentEnrollmentId(null);
            }

            // Kiểm tra vé đã dùng chưa
            boolean isUsed = false;
            if (ticket.getClassStudentEnrollment() != null && ticket.getTicketType() == TicketType.STUDENT_TICKET) {
                // Lấy id từ classStudentEnrollment
                Long cseId = ticket.getClassStudentEnrollment().getClassStudentEnrollmentId();
                Optional<Attendance> optional = attendanceRepository
                        .findByClassStudentEnrollmentIdAndTicketIdAndAttendanceDate(
                                cseId, ticket.getTicketId(), today);
                isUsed = optional.isPresent();
            } else {
                // Bơi lẻ, không có classStudentEnrollment
                Optional<Attendance> optional = attendanceRepository
                        .findByClassStudentEnrollmentIsNullAndTicketIdAndAttendanceDate(
                                ticket.getTicketId(), today);
                isUsed = optional.isPresent();
            }

            dto.setTicketIsUsed(isUsed);
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public TicketDTO getTicketById(Long id) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new AppException("Vé này không tồn tại!", ErrorCode.TICKET_NOT_FOUND));

        TicketDTO ticketDTO = new TicketDTO();
        BeanUtils.copyProperties(ticket, ticketDTO);
        if (ticket.getClassStudentEnrollment() != null) {
            ticketDTO.setClassStudentEnrollmentId(ticket.getClassStudentEnrollment().getClassStudentEnrollmentId());
        } else {
            ticketDTO.setClassStudentEnrollmentId(null);
        }
        return ticketDTO;
    }

    @Override
    @Transactional
    public TicketDTO createTicket(TicketDTO ticketDTO) throws WriterException, IOException {
        Ticket ticket = new Ticket();
        BeanUtils.copyProperties(ticketDTO, ticket, "classStudentEnrollmentId");

        // Thiết lập classStudentEnrollment nếu có
        if (ticketDTO.getClassStudentEnrollmentId() != null) {
            ClassStudentEnrollment cse = classStudentEnrollmentRepository
                    .findById(ticketDTO.getClassStudentEnrollmentId())
                    .orElseThrow(() -> new AppException(
                            "Không tìm thấy enrollment với ID " + ticketDTO.getClassStudentEnrollmentId(),
                            ErrorCode.ENROLLMENT_NOT_FOUND));
            ticket.setClassStudentEnrollment(cse);
        } else {
            ticket.setClassStudentEnrollment(null);
        }

        // Tìm giá vé theo ticketType
        TicketPrice price = ticketPriceRepository.findByTicketType(ticket.getTicketType());
        if (price != null) {
            ticket.setTicketPrice(price.getPrice());
        }

        // Lưu vé để lấy ticketId
        Ticket createdTicket = ticketRepository.save(ticket);

        // Cập nhật ticketId vào DTO
        ticketDTO.setTicketId(createdTicket.getTicketId());

        // Tạo ticketCode bằng JWT
        String ticketCode = ticketCodeService.generateTicketCode(ticketDTO);
        createdTicket.setTicketCode(ticketCode);

        // Lưu lại vé với ticketCode
        createdTicket = ticketRepository.save(createdTicket);

        // Tạo QR code từ ticketCode
        String qrCodeBase64 = qrCodeGenerator.generateQRCodeBase64(ticketCode, 250, 250);
        createdTicket.setQrCodeBase64(qrCodeBase64);

        // Lưu lại vé với QR code
        createdTicket = ticketRepository.save(createdTicket);

        // Chuyển đổi entity thành DTO để trả về
        TicketDTO createdTicketDTO = convertToDTO(createdTicket);
        return createdTicketDTO;
    }

    @Override
    @Transactional
    public TicketDTO updateTicket(Long id, TicketDTO ticketDTO) throws WriterException, IOException {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new AppException("Vé này không tồn tại!", ErrorCode.TICKET_NOT_FOUND));

        BeanUtils.copyProperties(ticketDTO, ticket, "classStudentEnrollmentId");

        if (ticketDTO.getClassStudentEnrollmentId() != null) {
            ClassStudentEnrollment cse = classStudentEnrollmentRepository
                    .findById(ticketDTO.getClassStudentEnrollmentId())
                    .orElseThrow(() -> new AppException(
                            "Không tìm thấy enrollment với ID " + ticketDTO.getClassStudentEnrollmentId(),
                            ErrorCode.ENROLLMENT_NOT_FOUND));
            ticket.setClassStudentEnrollment(cse);
        } else {
            ticket.setClassStudentEnrollment(null);
        }

        // Tạo ticketCode mới
        String ticketCode = ticketCodeService.generateTicketCode(convertToDTO(ticket));
        ticket.setTicketCode(ticketCode);

        // Tạo QR code từ ticketCode
        String qrCodeBase64 = qrCodeGenerator.generateQRCodeBase64(ticketCode, 250, 250);
        ticket.setQrCodeBase64(qrCodeBase64);

        Ticket updatedTicket = ticketRepository.save(ticket);

        TicketDTO updatedTicketDTO = convertToDTO(updatedTicket);
        return updatedTicketDTO;
    }

    @Override
    public void deleteTicket(Long id) {
        if (!ticketRepository.existsById(id)) {
            throw new AppException("Vé này không tồn tại!", ErrorCode.TICKET_NOT_FOUND);
        }

        if (orderDetailRepository.existsByTicketTicketId(id)) {
            throw new AppException("Vé này không thể xóa vì đã tồn tại trong đơn hàng!", ErrorCode.TICKET_IN_USE);
        }

        ticketRepository.deleteById(id);
    }

    @Override
    public TicketDTO getTicketByCode(String ticketCode) {
        Ticket ticket = ticketRepository.findByTicketCode(ticketCode)
                .orElseThrow(() -> new AppException("Vé không tồn tại hoặc đã bị hủy!", ErrorCode.TICKET_NOT_FOUND));

        TicketDTO ticketDTO = new TicketDTO();
        BeanUtils.copyProperties(ticket, ticketDTO);
        if (ticket.getClassStudentEnrollment() != null) {
            ticketDTO.setClassStudentEnrollmentId(ticket.getClassStudentEnrollment().getClassStudentEnrollmentId());
        } else {
            ticketDTO.setClassStudentEnrollmentId(null);
        }
        return ticketDTO;
    }

    private TicketDTO convertToDTO(Ticket ticket) {
        TicketDTO dto = new TicketDTO();
        BeanUtils.copyProperties(ticket, dto);
        if (ticket.getClassStudentEnrollment() != null) {
            dto.setClassStudentEnrollmentId(ticket.getClassStudentEnrollment().getClassStudentEnrollmentId());
        } else {
            dto.setClassStudentEnrollmentId(null);
        }
        return dto;
    }

    private Date getCurrentDateWithoutTime() {
        Calendar cal = Calendar.getInstance();
        cal.set(Calendar.HOUR_OF_DAY, 0);
        cal.set(Calendar.MINUTE, 0);
        cal.set(Calendar.SECOND, 0);
        cal.set(Calendar.MILLISECOND, 0);
        return cal.getTime();
    }
}
