package edu.poly.hightstar.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import edu.poly.hightstar.domain.Course;
import edu.poly.hightstar.domain.OrderDetail;
import edu.poly.hightstar.domain.Product;
import edu.poly.hightstar.domain.Ticket;
import edu.poly.hightstar.model.OrderDetailDTO;
import edu.poly.hightstar.repository.OrderDetailRepository;
import edu.poly.hightstar.service.OrderDetailService;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderDetailServiceImpl implements OrderDetailService {
    private final OrderDetailRepository orderDetailRepository;

    @Override
    public List<OrderDetailDTO> getOrderDetailsByOrderId(Long orderId) {
        List<OrderDetail> orderDetails = orderDetailRepository.findByOrderOrderId(orderId);

        return orderDetails.stream().map(orderDetail -> {
            OrderDetailDTO dto = new OrderDetailDTO();
            dto.setOrderId(orderDetail.getOrder().getOrderId());
            BeanUtils.copyProperties(orderDetail, dto);

            Product product = orderDetail.getProduct();
            Course course = orderDetail.getCourse();
            Ticket ticket = orderDetail.getTicket();
            // Lấy hình ảnh từ Product, Course hoặc Ticket nếu có
            if (product != null) {
                dto.setProductId(product.getProductId());
                dto.setImage(product.getProductImage());
                dto.setName(product.getProductName());
            } else if (course != null) {
                dto.setCourseId(course.getCourseId());
                dto.setImage(course.getCourseImage());
                dto.setName(course.getCourseName());
            } else if (ticket != null) {
                dto.setTicketId(ticket.getTicketId());
                dto.setImage("");
                dto.setName(ticket.getTicketType().toString());
            }
            return dto;
        }).collect(Collectors.toList());
    }

}
