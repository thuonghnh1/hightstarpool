package edu.poly.hightstar.service.impl;

import edu.poly.hightstar.domain.Course;
import edu.poly.hightstar.domain.Discount;
import edu.poly.hightstar.domain.Order;
import edu.poly.hightstar.domain.OrderDetail;
import edu.poly.hightstar.domain.Product;
import edu.poly.hightstar.domain.Ticket;
import edu.poly.hightstar.domain.User;
import edu.poly.hightstar.enums.OrderStatus;
import edu.poly.hightstar.model.OrderDTO;
import edu.poly.hightstar.model.OrderRequest;
import edu.poly.hightstar.repository.CourseRepository;
import edu.poly.hightstar.repository.DiscountRepository;
import edu.poly.hightstar.repository.OrderDetailRepository;
import edu.poly.hightstar.repository.OrderRepository;
import edu.poly.hightstar.repository.ProductRepository;
import edu.poly.hightstar.repository.TicketRepository;
import edu.poly.hightstar.repository.UserRepository;
import edu.poly.hightstar.service.OrderService;
import edu.poly.hightstar.utils.exception.AppException;
import edu.poly.hightstar.utils.exception.ErrorCode;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {
    private final OrderRepository orderRepository;
    private final OrderDetailRepository orderDetailRepository;
    private final UserRepository userRepository;
    private final DiscountRepository discountRepository;
    private final ProductRepository productRepository;
    private final CourseRepository courseRepository;
    private final TicketRepository ticketRepository;

    @Override
    public List<OrderDTO> getAllOrders() {
        return orderRepository.findAll().stream().map(order -> {
            OrderDTO dto = new OrderDTO();

            // Kiểm tra null trước khi gọi getUserId() và getDiscountId()
            if (order.getUser() != null) {
                dto.setUserId(order.getUser().getUserId());
            }

            if (order.getDiscount() != null) {
                dto.setDiscountId(order.getDiscount().getDiscountId());
            }

            BeanUtils.copyProperties(order, dto);
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public OrderDTO getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new AppException("Không tìm thấy đơn hàng này!", ErrorCode.ORDER_NOT_FOUND));

        OrderDTO orderDTO = new OrderDTO();
        BeanUtils.copyProperties(order, orderDTO);
        return orderDTO;
    }

    @Override
    public OrderDTO updateOrder(Long id, OrderDTO orderDTO) {
        // Tìm kiếm đơn hàng
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new AppException("Không tìm thấy đơn hàng này!", ErrorCode.ORDER_NOT_FOUND));

        BeanUtils.copyProperties(orderDTO, order);

        // Kiểm tra và gán User nếu userId không null
        if (orderDTO.getUserId() != null) {
            User user = userRepository.findById(orderDTO.getUserId())
                    .orElseThrow(() -> new AppException(
                            "Không tìm thấy người dùng có ID " + orderDTO.getUserId(),
                            ErrorCode.USER_NOT_FOUND));
            order.setUser(user);
        } else {
            order.setUser(null); // Gán null nếu userId không được cung cấp
        }
        Order updatedOrder = orderRepository.save(order);

        // Chuyển đổi sang DTO để trả về
        OrderDTO updatedOrderDTO = new OrderDTO();
        BeanUtils.copyProperties(updatedOrder, updatedOrderDTO);
        if (updatedOrder.getUser() != null) {
            updatedOrderDTO.setUserId(updatedOrder.getUser().getUserId());
        }
        return updatedOrderDTO;
    }

    @Override
    @Transactional
    public OrderDTO createInvoice(OrderRequest request) {
        // Lưu thông tin Order
        Order order = prepareOrder(request); // chuẩn bị dữ liệu cho order
        Order savedOrder = orderRepository.save(order);

        // Tạo danh sách OrderDetail
        List<OrderDetail> orderDetails = request.getOrderDetails().stream().map(detailDTO -> {
            OrderDetail orderDetail = new OrderDetail();
            orderDetail.setOrder(savedOrder);
            orderDetail.setQuantity(detailDTO.getQuantity());
            orderDetail.setUnitPrice(detailDTO.getUnitPrice());

            // Biến cờ để kiểm tra nếu có ít nhất một liên kết tồn tại
            boolean hasValidReference = false;

            // Liên kết các bảng liên quan
            if (detailDTO.getProductId() != null) {
                Product product = productRepository.findById(detailDTO.getProductId())
                        .orElseThrow(
                                () -> new AppException("Không tìm thấy sản phẩm này!", ErrorCode.PRODUCT_NOT_FOUND));
                orderDetail.setProduct(product);
                hasValidReference = true;
            }
            if (detailDTO.getCourseId() != null) {
                Course course = courseRepository.findById(detailDTO.getCourseId())
                        .orElseThrow(
                                () -> new AppException("Không tìm thấy khóa học này!", ErrorCode.COURSE_NOT_FOUND));
                orderDetail.setCourse(course);
                hasValidReference = true;
            }
            if (detailDTO.getTicketId() != null) {
                Ticket ticket = ticketRepository.findById(detailDTO.getTicketId())
                        .orElseThrow(() -> new AppException("Không tìm thấy vé bơi này!", ErrorCode.TICKET_NOT_FOUND));
                orderDetail.setTicket(ticket);
                hasValidReference = true;
            }

            // Nếu không có liên kết hợp lệ nào được tìm thấy, ném ngoại lệ
            if (!hasValidReference) {
                throw new AppException("Không có sản phẩm, khóa học hoặc vé nào tồn tại trong đơn hàng!",
                        ErrorCode.INVALID_ORDER_DETAILS);
            }

            return orderDetail;
        }).collect(Collectors.toList());

        // Lưu toàn bộ OrderDetails vào database
        orderDetailRepository.saveAll(orderDetails);

        // Tạo DTO trả về
        OrderDTO newOrderDTO = new OrderDTO();
        BeanUtils.copyProperties(savedOrder, newOrderDTO);
        return newOrderDTO;
    }

    public Order prepareOrder(OrderRequest request) {
        // Tạo đối tượng Order từ request
        Order order = new Order();
        OrderDTO orderDTO = request.getOrder();
        BeanUtils.copyProperties(orderDTO, order);
        System.out.println(order.getPaymentMethod());
        order.setStatus(OrderStatus.COMPLETED); // Trạng thái mặc định

        if (orderDTO.getDiscountId() != null) {
            Discount discount = discountRepository.findById(orderDTO.getDiscountId())
                    .orElseThrow(
                            () -> new AppException("Giảm giá này không thể tìm thấy!", ErrorCode.DISCOUNT_NOT_FOUND));
            order.setDiscount(discount);
        }

        if (orderDTO.getUserId() != null) {
            User user = userRepository.findById(orderDTO.getUserId())
                    .orElseThrow(() -> new AppException("Không tìm thấy người dùng này trên hệ thống!",
                            ErrorCode.USER_NOT_FOUND));
            order.setUser(user);
        }

        return order;
    }
}
