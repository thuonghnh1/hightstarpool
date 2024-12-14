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
import edu.poly.hightstar.repository.OrderDetailRepository;
import edu.poly.hightstar.repository.StudentRepository;
import edu.poly.hightstar.repository.TicketPriceRepository;
import edu.poly.hightstar.domain.Attendance;
import edu.poly.hightstar.domain.Student;
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
    private final StudentRepository studentRepository;
    private final TicketPriceRepository ticketPriceRepository;
    private final TicketCodeService ticketCodeService;
    private final AttendanceRepository attendanceRepository;
    private final QRCodeGenerator qrCodeGenerator;
    private final OrderDetailRepository orderDetailRepository;

    Date today = getCurrentDateWithoutTime();

    @Override
    @Transactional
    public List<TicketDTO> getAllTickets() {
        return ticketRepository.findAll().stream().map(ticket -> {
            TicketDTO dto = new TicketDTO();
            BeanUtils.copyProperties(ticket, dto);
            if (ticket.getStudent() != null) {
                dto.setStudentId(ticket.getStudent().getStudentId());
            }
            // Kiểm tra trạng thái vé ngày hôm nay đã dùng chưa
            boolean isUsed = false;
            if (ticket.getStudent() != null && ticket.getTicketType() == TicketType.STUDENT_TICKET) {
                Optional<Attendance> optional = attendanceRepository
                        .findByStudentStudentIdAndTicketTicketIdAndAttendanceDate(ticket.getStudent().getStudentId(),
                                ticket.getTicketId(), today);
                if (optional.isPresent()) {
                    isUsed = true;
                }
            } else {
                Optional<Attendance> optional = attendanceRepository
                        .findByStudentIsNullAndTicketTicketIdAndAttendanceDate(
                                ticket.getTicketId(), today);
                if (optional.isPresent()) {
                    isUsed = true;
                }
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
        if (ticket.getStudent() != null) {
            ticketDTO.setStudentId(ticket.getStudent().getStudentId());
        } else {
            ticketDTO.setStudentId(null);
        }
        return ticketDTO;
    }

    @Override
    @Transactional
    public TicketDTO createTicket(TicketDTO ticketDTO) throws WriterException, IOException {

        // Tạo entity từ DTO
        Ticket ticket = new Ticket();
        BeanUtils.copyProperties(ticketDTO, ticket, "student");

        // Kiểm tra nếu studentId khác null
        if (ticketDTO.getStudentId() != null) {
            Student student = studentRepository.findById(ticketDTO.getStudentId())
                    .orElseThrow(() -> new AppException("Không tìm thấy học viên với ID " + ticketDTO.getStudentId(),
                            ErrorCode.USER_NOT_FOUND));
            ticket.setStudent(student);
        } else {
            ticket.setStudent(null);
        }

        // Truy vấn giá vé từ bảng TicketPrice dựa trên ticketType
        TicketPrice price = ticketPriceRepository.findByTicketType(ticket.getTicketType());

        if (price != null) {
            ticket.setTicketPrice(price.getPrice());
        }

        // Lưu vé để lấy ticketId tự động
        Ticket createdTicket = ticketRepository.save(ticket);

        // Cập nhật ticketId vào DTO
        ticketDTO.setTicketId(createdTicket.getTicketId());

        // Tạo ticketCode bằng JWT
        String ticketCode = ticketCodeService.generateTicketCode(ticketDTO);
        createdTicket.setTicketCode(ticketCode);

        // Cập nhật lại vé với ticketCode
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
        // Tìm vé theo ID, nếu không tồn tại thì ném AppException
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new AppException("Vé này không tồn tại!", ErrorCode.TICKET_NOT_FOUND));

        // Sao chép các thuộc tính từ ticketDTO sang ticket (trừ student)
        BeanUtils.copyProperties(ticketDTO, ticket, "student");

        // Kiểm tra xem ticketDTO có chứa studentId không
        if (ticketDTO.getStudentId() != null) {
            // Nếu studentId khác null, tìm student theo ID
            Student student = studentRepository.findById(ticketDTO.getStudentId())
                    .orElseThrow(() -> new AppException("Không tìm thấy người dùng với ID " + ticketDTO.getStudentId(),
                            ErrorCode.USER_NOT_FOUND));
            // Thiết lập student cho ticket
            ticket.setStudent(student);
        } else {
            // Nếu studentId là null, đặt student của ticket thành null
            ticket.setStudent(null);
        }

        // Tạo ticketCode mới nếu cần (nếu bạn muốn cập nhật mã QR khi cập nhật vé)
        String ticketCode = ticketCodeService.generateTicketCode(convertToDTO(ticket));
        ticket.setTicketCode(ticketCode);

        // Tạo QR code từ ticketCode
        String qrCodeBase64 = qrCodeGenerator.generateQRCodeBase64(ticketCode, 250, 250);
        ticket.setQrCodeBase64(qrCodeBase64);

        // Lưu ticket đã cập nhật vào cơ sở dữ liệu
        Ticket updatedTicket = ticketRepository.save(ticket);

        // Chuẩn bị đối tượng DTO để trả về
        TicketDTO updatedTicketDTO = convertToDTO(updatedTicket);
        return updatedTicketDTO;
    }

    @Override
    public void deleteTicket(Long id) {
        if (!ticketRepository.existsById(id)) {
            throw new AppException("Vé này không tồn tại!", ErrorCode.TICKET_NOT_FOUND);
        }

        // Kiểm tra xem vé có đang được sử dụng trong đơn hàng hay không
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
        if (ticket.getStudent() != null) {
            ticketDTO.setStudentId(ticket.getStudent().getStudentId());
        } else {
            ticketDTO.setStudentId(null);
        }
        return ticketDTO;
    }

    // Phương thức chuyển đổi từ Ticket entity sang TicketDTO
    private TicketDTO convertToDTO(Ticket ticket) {
        TicketDTO dto = new TicketDTO();
        BeanUtils.copyProperties(ticket, dto);
        if (ticket.getStudent() != null) {
            dto.setStudentId(ticket.getStudent().getStudentId());
        } else {
            dto.setStudentId(null);
        }
        return dto;
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
}
