package edu.poly.hightstar.controller.admin;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import edu.poly.hightstar.domain.TicketPrice;
import edu.poly.hightstar.enums.TicketType;
import edu.poly.hightstar.service.TicketPriceService;
import edu.poly.hightstar.utils.exception.AppException;
import edu.poly.hightstar.utils.exception.ErrorCode;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/ticket-prices")
@RequiredArgsConstructor
public class TicketPriceController {

    private final TicketPriceService ticketPriceService;

    // Lấy tất cả giá vé
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    @GetMapping
    public List<TicketPrice> getAllTicketPrices() {
        return ticketPriceService.getAllTicketPrices();
    }

    // Tìm giá vé theo loại vé
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    @GetMapping("/search-by-ticket-type")
    public TicketPrice getTicketPriceByTicketType(@RequestParam String ticketType) {
        // Chuyển đổi ticketType từ String sang TicketType enum
        TicketType type = TicketType.valueOf(ticketType.toUpperCase());
        return ticketPriceService.getTicketPriceByTicketType(type);
    }

    // Tạo mới giá vé
    @PreAuthorize("hasAnyRole('ADMIN')")
    @PostMapping
    public ResponseEntity<TicketPrice> createTicketPrice(@RequestBody TicketPrice ticketPrice) {
        TicketPrice createdTicketPrice = ticketPriceService.saveOrUpdateTicketPrice(ticketPrice);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTicketPrice);
    }

    // Cập nhật giá vé theo TicketType
    @PreAuthorize("hasAnyRole('ADMIN')")
    @PutMapping("/{ticketType}")
    public TicketPrice updateTicketPriceByTicketType(@PathVariable String ticketType,
            @RequestBody TicketPrice ticketPrice) {
        // Chuyển đổi ticketType từ String sang TicketType enum
        TicketType type = TicketType.valueOf(ticketType.toUpperCase());
        TicketPrice existingTicketPrice = ticketPriceService.getTicketPriceByTicketType(type);

        if (existingTicketPrice == null) {
            throw new AppException("Không tìm thấy giá vé của loại vé:" + type, ErrorCode.TICKET_PRICE_NOT_FOUND);
        }
        existingTicketPrice.setPrice(ticketPrice.getPrice());
        return ticketPriceService.saveOrUpdateTicketPrice(existingTicketPrice);
    }

}
