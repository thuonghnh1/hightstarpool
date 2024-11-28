package edu.poly.hightstar.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import edu.poly.hightstar.repository.TicketRepository;
import edu.poly.hightstar.repository.StudentRepository;
import edu.poly.hightstar.domain.Student;
import edu.poly.hightstar.domain.Ticket;
import edu.poly.hightstar.model.TicketDTO;
import edu.poly.hightstar.service.TicketService;
import edu.poly.hightstar.utils.exception.AppException;
import edu.poly.hightstar.utils.exception.ErrorCode;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TicketServiceImpl implements TicketService {
    private final TicketRepository ticketRepository;
    private final StudentRepository studentRepository;

    @Override
    public List<TicketDTO> getAllTickets() {
        return ticketRepository.findAll().stream().map(ticket -> {
            TicketDTO dto = new TicketDTO();

            if (ticket.getStudent() != null) {
                dto.setStudentId(ticket.getStudent().getStudentId());
            }
            BeanUtils.copyProperties(ticket, dto);
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public TicketDTO getTicketById(Long id) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new AppException("Vé này không tồn tại!", ErrorCode.TICKET_NOT_FOUND));

        TicketDTO ticketDTO = new TicketDTO();
        BeanUtils.copyProperties(ticket, ticketDTO);
        return ticketDTO;
    }

    @Override
    public TicketDTO createTicket(TicketDTO ticketDTO) {
        Ticket ticket = new Ticket();
        // Sao chép các thuộc tính từ ticketDTO sang ticket (trừ student)
        BeanUtils.copyProperties(ticketDTO, ticket, "student");

        // Kiểm tra nếu studentId khác null
        if (ticketDTO.getStudentId() != null) {
            Student student = studentRepository.findById(ticketDTO.getStudentId())
                    .orElseThrow(() -> new AppException("Không tìm thấy học viên với ID " + ticketDTO.getStudentId(),
                            ErrorCode.USER_NOT_FOUND));
            ticket.setStudent(student);
        } else {
            // Nếu studentId là null, thiết lập student của ticket thành null
            ticket.setStudent(null);
        }

        // Lưu ticket vào cơ sở dữ liệu
        Ticket createdTicket = ticketRepository.save(ticket);

        // Chuẩn bị DTO để trả về
        TicketDTO createdTicketDTO = new TicketDTO();
        BeanUtils.copyProperties(createdTicket, createdTicketDTO);

        // Kiểm tra nếu student không null, thiết lập studentId vào DTO
        if (createdTicket.getStudent() != null) {
            createdTicketDTO.setStudentId(createdTicket.getStudent().getStudentId());
        } else {
            createdTicketDTO.setStudentId(null); // Đảm bảo studentId là null khi student là null
        }

        return createdTicketDTO;
    }

    @Override
    public TicketDTO updateTicket(Long id, TicketDTO ticketDTO) {
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

        // Lưu ticket đã cập nhật vào cơ sở dữ liệu
        Ticket updatedTicket = ticketRepository.save(ticket);

        // Chuẩn bị đối tượng DTO để trả về
        TicketDTO updatedTicketDTO = new TicketDTO();
        BeanUtils.copyProperties(updatedTicket, updatedTicketDTO);

        // Kiểm tra nếu student không null, thiết lập studentId vào DTO
        if (updatedTicket.getStudent() != null) {
            updatedTicketDTO.setStudentId(updatedTicket.getStudent().getStudentId());
        } else {
            updatedTicketDTO.setStudentId(null); // Đảm bảo studentId là null khi student là null
        }

        return updatedTicketDTO;
    }

    @Override
    public void deleteTicket(Long id) {
        if (!ticketRepository.existsById(id)) {
            throw new AppException("Vé này không tồn tại!", ErrorCode.DISCOUNT_NOT_FOUND);
        }
        ticketRepository.deleteById(id);
    }
}
