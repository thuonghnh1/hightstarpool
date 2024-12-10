package edu.poly.hightstar.service.impl;

import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.poly.hightstar.repository.TicketRepository;
import edu.poly.hightstar.repository.StudentRepository;
import edu.poly.hightstar.repository.TicketPriceRepository;
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
    private final QRCodeGenerator qrCodeGenerator;

    @Override
    public List<TicketDTO> getAllTickets() {
        return ticketRepository.findAll().stream().map(ticket -> {
            TicketDTO dto = new TicketDTO();
            BeanUtils.copyProperties(ticket, dto);
            if (ticket.getStudent() != null) {
                dto.setStudentId(ticket.getStudent().getStudentId());
            }
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
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
        // Đặt issueDate là hiện tại
        Date issueDate = new Date();
        ticketDTO.setIssueDate(issueDate);

        // Đặt expiryDate dựa trên ticketType
        Date expiryDate = calculateExpiryDate(issueDate, ticketDTO.getTicketType());
        ticketDTO.setExpiryDate(expiryDate);

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

        // Cập nhật expiryDate dựa trên ticketType nếu cần thiết
        Date issueDate = ticket.getIssueDate();
        Date expiryDate = calculateExpiryDate(issueDate, ticket.getTicketType());
        ticket.setExpiryDate(expiryDate);

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

    // Phương thức tính toán ngày hết hạn dựa trên loại vé
    private Date calculateExpiryDate(Date issueDate, TicketType ticketType) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(issueDate);
        switch (ticketType) {
            case ONETIME_TICKET:
                // Hạn vé trong ngày tạo đến hết ngày đó (23:59:59)
                calendar.set(Calendar.HOUR_OF_DAY, 23);
                calendar.set(Calendar.MINUTE, 59);
                calendar.set(Calendar.SECOND, 59);
                calendar.set(Calendar.MILLISECOND, 999);
                break;
            case WEEKLY_TICKET:
                calendar.add(Calendar.DAY_OF_MONTH, 7); // Thêm 7 ngày
                break;
            case MONTHLY_TICKET:
                calendar.add(Calendar.DAY_OF_MONTH, 30); // Thêm 30 ngày
                break;
            case STUDENT_TICKET:
                calendar.add(Calendar.YEAR, 1); // Thêm 1 năm
                break;
            default:
                calendar.add(Calendar.DAY_OF_MONTH, 30); // Mặc định 30 ngày
                break;
        }
        return calendar.getTime();
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
}
