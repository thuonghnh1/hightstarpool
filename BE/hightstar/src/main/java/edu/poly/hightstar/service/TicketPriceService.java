package edu.poly.hightstar.service;

import java.util.List;

import edu.poly.hightstar.domain.TicketPrice;
import edu.poly.hightstar.enums.TicketType;

public interface TicketPriceService {

    // Lưu hoặc cập nhật giá vé
    TicketPrice saveOrUpdateTicketPrice(TicketPrice ticketPrice);

    // Xóa giá vé theo loại vé
    void deleteTicketPriceByTicketType(TicketType ticketType);

    // Lấy giá vé theo loại vé
    TicketPrice getTicketPriceByTicketType(TicketType ticketType);

    // Lấy tất cả giá vé
    List<TicketPrice> getAllTicketPrices();
}
