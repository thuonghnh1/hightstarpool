package edu.poly.hightstar.controller;

import edu.poly.hightstar.model.DiscountDto;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;

@RestController
public class DiscountController {

    @GetMapping("/api/discounts")
    public List<DiscountDto> getDiscounts() {
        List<DiscountDto> discounts = Arrays.asList(
                new DiscountDto(1, "Khuyến Mãi 10% Giảm Giá Sản Phẩm", 10, "01/01/2024", "31/01/2024",
                        "Giảm giá 10% cho tất cả các sản phẩm trong tháng 1."),
                new DiscountDto(2, "Giảm Giá 20% Mua Đơn Hàng Trên 1 Triệu", 20, "15/02/2024", "15/03/2024",
                        "Giảm giá 20% cho các đơn hàng có giá trị trên 1 triệu đồng."),
                new DiscountDto(3, "Giảm Giá 5% Cho Thành Viên Mới", 5, "01/01/2024", "30/04/2024",
                        "Giảm giá 5% cho thành viên mới đăng ký trong vòng 3 tháng đầu."),
                new DiscountDto(4, "Khuyến Mãi Mùa Hè Giảm 15%", 15, "01/06/2024", "30/06/2024",
                        "Giảm giá 15% cho các đơn hàng trong tháng 6."),
                new DiscountDto(5, "Giảm Giá 25% Sản Phẩm Công Nghệ", 25, "01/07/2024", "31/07/2024",
                        "Giảm giá 25% cho tất cả sản phẩm công nghệ."),
                new DiscountDto(6, "Mua 2 Tặng 1", 0, "01/08/2024", "31/08/2024",
                        "Mua 2 sản phẩm bất kỳ, tặng 1 sản phẩm miễn phí."),
                new DiscountDto(7, "Giảm Giá 30% Cho Sinh Viên", 30, "01/09/2024", "30/09/2024",
                        "Giảm giá 30% cho sinh viên khi xuất trình thẻ sinh viên."),
                new DiscountDto(8, "Khuyến Mãi Đặc Biệt Tháng 10", 20, "01/10/2024", "31/10/2024",
                        "Giảm giá 20% cho tất cả các sản phẩm trong tháng 10."),
                new DiscountDto(9, "Giảm Giá 40% Black Friday", 40, "25/11/2024", "27/11/2024",
                        "Giảm giá 40% cho các sản phẩm vào dịp Black Friday."),
                new DiscountDto(10, "Giảm Giá 50% Cuối Năm", 50, "01/12/2024", "31/12/2024",
                        "Giảm giá 50% cho tất cả sản phẩm vào cuối năm."));

        return discounts;
    }
}
