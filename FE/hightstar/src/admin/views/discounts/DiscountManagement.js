import { useEffect, useState } from "react";
import axios from "axios"; // Import axios
import TableManagement from "../../components/common/TableManagement";
import { Spinner, Form } from "react-bootstrap";
import { formatDateToISO, formatDateToDMY } from "../../utils/formatDate";

const DiscountManagement = () => {
  // State để lưu trữ dữ liệu giảm giá từ API
  // const [discountData, setDiscountData] = useState([]);
  const [formData, setFormData] = useState({}); // State quản lý dữ liệu hiện tại
  const [errorFields, setErrorFields] = useState({}); // State quản lý lỗi
  const [isEditing, setIsEditing] = useState(false); // Trạng thái để biết đang thêm mới hay chỉnh sửa

  // // Mảng dữ liệu giảm giá (mock data)
  const discountData = [
    {
      id: "ABC",
      name: "Khuyến Mãi 10% Giảm Giá Sản Phẩm",
      percentage: 10,
      startDate: "2024-01-01",
      endDate: "2024-01-31",
      description: "Giảm giá 10% cho tất cả các sản phẩm trong tháng 1.",
    },
    {
      id: "ABCD",
      name: "Giảm Giá 20% Mua Đơn Hàng Trên 1 Triệu",
      percentage: 20,
      startDate: "2024-02-15",
      endDate: "2024-03-15",
      description:
        "Giảm giá 20% cho các đơn hàng có giá trị trên 1 triệu đồng.",
    },
    {
      id: "BCD",
      name: "Giảm Giá 30% Khi Mua 2 Sản Phẩm",
      percentage: 30,
      startDate: "2024-04-01",
      endDate: "2024-04-30",
      description: "Giảm giá 30% khi mua từ 2 sản phẩm trở lên.",
    },
    {
      id: "GGKHM",
      name: "Khuyến Mãi 10% Giảm Giá Sản Phẩm",
      percentage: 10,
      startDate: "2024-01-01",
      endDate: "2024-01-31",
      description: "Khuyến mãi giảm 10% cho tất cả các sản phẩm trong tháng 1.",
    },
    {
      id: "GGDHTMT",
      name: "Giảm Giá 20% Mua Đơn Hàng Trên 1 Triệu",
      percentage: 20,
      startDate: "2024-02-15",
      endDate: "2024-03-15",
      description: "Ưu đãi 20% cho đơn hàng từ 1 triệu đồng trở lên.",
    },
    {
      id: "GGKMHSP",
      name: "Giảm Giá 30% Khi Mua 2 Sản Phẩm",
      percentage: 30,
      startDate: "2024-04-01",
      endDate: "2024-04-30",
      description: "Mua từ 2 sản phẩm được giảm giá 30%.",
    },
    {
      id: "KMGGSP",
      name: "Khuyến Mãi 10% Giảm Giá Sản Phẩm",
      percentage: 10,
      startDate: "2024-01-01",
      endDate: "2024-01-31",
      description: "Giảm giá 10% cho sản phẩm trong tháng 1.",
    },
    {
      id: "GG20HT1T",
      name: "Giảm Giá 20% Mua Đơn Hàng Trên 1 Triệu",
      percentage: 20,
      startDate: "2024-02-15",
      endDate: "2024-03-15",
      description:
        "Giảm giá 20% cho đơn hàng trên 1 triệu đồng từ ngày 15/02 đến 15/03.",
    },
    {
      id: "GG30KMH2SP",
      name: "Giảm Giá 30% Khi Mua 2 Sản Phẩm",
      percentage: 30,
      startDate: "2024-04-01",
      endDate: "2024-04-30",
      description: "Ưu đãi giảm 30% khi mua 2 sản phẩm trở lên.",
    },
    {
      id: "UD010",
      name: "Khuyến Mãi 10% Giảm Giá Sản Phẩm",
      percentage: 10,
      startDate: "2024-01-01",
      endDate: "2024-01-31",
      description: "Khuyến mãi giảm giá 10% cho sản phẩm trong tháng 1.",
    },
    {
      id: "UD011",
      name: "Giảm Giá 20% Mua Đơn Hàng Trên 1 Triệu",
      percentage: 20,
      startDate: "2024-02-15",
      endDate: "2024-03-15",
      description:
        "Ưu đãi 20% cho các đơn hàng trên 1 triệu đồng từ ngày 15/02 đến 15/03.",
    },
    {
      id: "UD012",
      name: "Giảm Giá 30% Khi Mua 2 Sản Phẩm",
      percentage: 30,
      startDate: "2024-04-01",
      endDate: "2024-04-30",
      description:
        "Giảm giá 30% cho khách hàng mua từ 2 sản phẩm trong tháng 4.",
    },
  ];

  // State để xử lý trạng thái tải dữ liệu và lỗi

  // const [loading, setLoading] = useState(true);
  // const [errorServer, setErrorServer] = useState(null);

  // // Hàm lấy dữ liệu từ API
  // const fetchDiscountData = async () => {
  //   try {
  //     const response = await axios.get("https://your-api-endpoint/discounts"); // Thay URL bằng endpoint thực tế
  //     setDiscountData(response.data); // Lưu dữ liệu vào state
  //     setLoading(false); // Tắt trạng thái loading
  //   } catch (err) {
  //     setErrorServer(err.message); // Lưu lỗi vào state nếu có
  //     setLoading(false);
  //   }
  // };

  // // Gọi API khi component được render lần đầu tiên (sử dụng useEffect)
  // useEffect(() => {
  //   fetchDiscountData();
  // }, []); // Mảng [] đảm bảo useEffect chỉ chạy một lần khi component được mount

  // Mảng cột của bảng
  const discountColumns = [
    { key: "id", label: "Mã giảm giá" },
    { key: "name", label: "Tên giảm giá" },
    { key: "percentage", label: "Phần trăm giảm (%)" },
    { key: "startDate", label: "Ngày Bắt Đầu" },
    { key: "endDate", label: "Ngày Kết Thúc" },
    { key: "description", label: "Mô tả" },
  ];

  // Loại bỏ cột 'description' khỏi discountColumns
  const defaultColumns = discountColumns.filter(
    (column) => column.key !== "description"
  );

  // // Xử lý khi dữ liệu đang tải hoặc có lỗi
  // if (loading) {
  //   return <Spinner></Spinner>;
  // }

  // if (errorServer) {
  //   return <div>Đã xảy ra lỗi: {errorServer}</div>;
  // }

  // Hàm validate cho từng trường input (ví dụ kiểm tra tên không được có số)
  const validateField = (key, value) => {
    let error = "";

    switch (key) {
      case "name":
        // Kiểm tra tên không được chứa số và không được để trống
        if (!value || value.trim() === "") {
          error = "Tên không được để trống.";
        }
        break;

      case "percentage":
        // Kiểm tra tỷ lệ giảm giá phải là số từ 0 đến 100
        if (value === "" || value === null) {
          error = "Tỷ lệ giảm giá không được để trống.";
        } else if (isNaN(value) || value < 0 || value > 100) {
          error = "Tỷ lệ giảm giá phải là một số từ 0 đến 100.";
        }
        break;

      case "startDate":
        if (!value) {
          error = "Ngày bắt đầu không được để trống.";
        }
        break;

      case "endDate":
        // Kiểm tra ngày kết thúc không được để trống và phải sau ngày bắt đầu
        if (!value) {
          error = "Ngày kết thúc không được để trống.";
        } else if (new Date(value) <= new Date(formData.startDate)) {
          error = "Ngày kết thúc phải sau ngày bắt đầu.";
        }
        break;

      default:
        break;
    }

    setErrorFields((prevErrors) => ({
      ...prevErrors,
      [key]: error,
    }));
  };

  // Hàm validate toàn bộ form
  const validateForm = () => {
    const newErrors = {};

    // Validate từng trường và lưu lỗi vào newErrors
    if (!formData.name || formData.name.trim() === "") {
      newErrors.name = "Tên không được để trống.";
    }

    if (formData.percentage === "" || formData.percentage === null) {
      newErrors.percentage = "Tỷ lệ giảm giá không được để trống.";
    } else if (
      isNaN(formData.percentage) ||
      formData.percentage < 0 ||
      formData.percentage > 100
    ) {
      newErrors.percentage =
        "Tỷ lệ giảm giá phải là một số từ lớn hơn 0 đến 100.";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Ngày bắt đầu không được để trống.";
    }

    if (!formData.endDate) {
      newErrors.endDate = "Ngày kết thúc không được để trống.";
    } else if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      newErrors.endDate = "Ngày kết thúc phải sau ngày bắt đầu.";
    }

    // Cập nhật state errorFields với các lỗi mới
    setErrorFields(newErrors);

    // Trả về true nếu không có lỗi
    return Object.keys(newErrors).length === 0;
  };

  // Hàm xử lý khi người dùng thay đổi giá trị input
  const handleInputChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
    validateField(key, value); // Gọi validate cho từng input
  };

  // Hàm gọi khi nhấn "Thêm mới" để reset form
  const handleAddNew = () => {
    setFormData({
      name: "",
      percentage: "",
      startDate: new Date().toISOString().split("T")[0], // Ngày hiện tại
      endDate: "",
      description: "",
    });
    setIsEditing(false); // Chuyển về chế độ thêm mới
    setErrorFields({});
  };

  // Hàm gọi khi nhấn "Sửa" một hàng để đổ dữ liệu lên form
  const handleEdit = (item) => {
    setFormData({
      ...item,
      startDate: formatDateToISO(item.startDate), // vì input date chỉ nhận kiểu này
      endDate: formatDateToISO(item.startDate),
    });
    setIsEditing(true); // Chuyển về chế độ chỉnh sửa
    setErrorFields({});
  };

  const handleSaveItem = () => {
    // Nếu đang chỉnh sửa
    if (isEditing) {
      // Tìm mục giảm giá đang chỉnh sửa dựa vào `id`
      const updatedDiscounts = discountData.map((discount) => {
        if (discount.id === formData.id) {
          return {
            ...formData,
            startDate: formatDateToDMY(formData.startDate), // chuyển về lại định dạng cũ.
            startDate: formatDateToDMY(formData.endDate),
          };
        }
      });

      // Cập nhật mảng discountData
      discountData = updatedDiscounts;
      // setDiscountData(updatedDiscounts); // Nếu sử dụng state để lưu dữ liệu

      // Gọi API cập nhật (ví dụ sử dụng axios)
      axios
        .put(`https://your-api-endpoint/discounts/${formData.id}`, formData)
        .then((response) => {
          // Xử lý sau khi cập nhật thành công (nếu cần)
          console.log("Cập nhật thành công", response.data);
        })
        .catch((error) => {
          // Xử lý lỗi khi gọi API
          console.error("Lỗi khi cập nhật", error);
        });
    } else {
      // Nếu đang ở trạng thái thêm mới
      const newDiscount = {
        ...formData,
        id: Date.now().toString(), // Tạo id tạm thời cho mục mới
      };

      // Cập nhật mảng discountData
      // setDiscountData([...discountData, newDiscount]); // Nếu sử dụng state

      // Gọi API thêm mới
      axios
        .post("https://your-api-endpoint/discounts", newDiscount)
        .then((response) => {
          // Xử lý sau khi thêm thành công (nếu cần)
          console.log("Thêm mới thành công", response.data);
        })
        .catch((error) => {
          // Xử lý lỗi khi gọi API
          console.error("Lỗi khi thêm mới", error);
        });
    }

    // Reset form sau khi lưu thành công
    handleAddNew(); // Để làm sạch form và chuyển về trạng thái thêm mới
  };

  const modalContent = (
    <>
      <div className="row">
        {/* Hàng 1 */}
        <div className="col-md-6 mb-3">
          <Form.Group controlId="formName">
            <Form.Label>Tên chương trình khuyến mãi</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              isInvalid={!!errorFields.name} // Kiểm tra lỗi để hiển thị thông báo
              required
            />
            <Form.Control.Feedback type="invalid">
              {errorFields.name}
            </Form.Control.Feedback>
          </Form.Group>
        </div>

        <div className="col-md-6 mb-3">
          <Form.Group controlId="formPercentage">
            <Form.Label>Tỷ lệ giảm giá (%)</Form.Label>
            <Form.Control
              type="number"
              name="percentage"
              min={0}
              max={100}
              value={formData.percentage}
              onChange={(e) => handleInputChange("percentage", e.target.value)}
              isInvalid={!!errorFields.percentage}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errorFields.percentage}
            </Form.Control.Feedback>
          </Form.Group>
        </div>

        {/* Hàng 2 */}
        <div className="col-md-6 mb-3">
          <Form.Group controlId="formStartDate">
            <Form.Label>Ngày bắt đầu</Form.Label>
            <Form.Control
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={(e) => handleInputChange("startDate", e.target.value)}
              isInvalid={!!errorFields.startDate}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errorFields.startDate}
            </Form.Control.Feedback>
          </Form.Group>
        </div>

        <div className="col-md-6 mb-3">
          <Form.Group controlId="formEndDate">
            <Form.Label>Ngày kết thúc</Form.Label>
            <Form.Control
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={(e) => handleInputChange("endDate", e.target.value)}
              isInvalid={!!errorFields.endDate}
            />
            <Form.Control.Feedback type="invalid">
              {errorFields.endDate}
            </Form.Control.Feedback>
          </Form.Group>
        </div>

        {/* Hàng 3 - Mô tả */}
        <div className="col-12 mb-3">
          <Form.Group controlId="formDescription">
            <Form.Label>Mô tả</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              rows={3}
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
            />
          </Form.Group>
        </div>
      </div>
    </>
  );

  return (
    <TableManagement
      data={discountData}
      columns={discountColumns}
      title={"Quản lý giảm giá"}
      defaultColumns={defaultColumns} // Truyền mảng cột đã lọc
      modalContent={modalContent}
      isEditing={isEditing}
      validateForm={validateForm}
      handleAddNew={handleAddNew}
      handleEdit={handleEdit}
      handleSaveItem={handleSaveItem}
    />
  );
};

export default DiscountManagement;
