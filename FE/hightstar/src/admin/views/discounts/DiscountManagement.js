import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import TableManagement from "../../components/common/TableManagement";
import DiscountService from "../../services/DiscountService";
import Page500 from "../../../common/pages/Page500";
import { Helmet } from "react-helmet-async";
import {
  formatDateTimeToISO,
  formatDateTimeToDMY,
  formatDateTimeLocal,
} from "../../utils/FormatDate";
import { Spinner, Form } from "react-bootstrap";

const DiscountManagement = () => {
  // State để lưu trữ dữ liệu giảm giá từ API
  const [discountData, setDiscountData] = useState([]);
  const [formData, setFormData] = useState({}); // State quản lý dữ liệu hiện tại
  const [errorFields, setErrorFields] = useState({}); // State quản lý lỗi
  const [statusFunction, setStatusFunction] = useState({ isAdd: false, isEditing: false, isViewDetail: false }); // Trạng thái để biết đang thêm mới hay chỉnh sửa hay xem chi tiết
  // State để xử lý trạng thái tải dữ liệu và lỗi
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(false); // này để load cho toàn bộ trang dữ liệu
  const [errorServer, setErrorServer] = useState(null);

  // Mảng cột của bảng
  const discountColumns = [
    { key: "id", label: "ID" },
    { key: "discountName", label: "Tên giảm giá" },
    { key: "percentage", label: "Phần trăm giảm (%)" },
    { key: "startDate", label: "Ngày Bắt Đầu" },
    { key: "endDate", label: "Ngày Kết Thúc" },
    { key: "description", label: "Mô tả" },
  ];

  // Loại bỏ một số cột không cần thiết khỏi discountColumns
  const keysToRemove = ["description"];
  const defaultColumns = discountColumns.filter(
    (column) => !keysToRemove.includes(column.key)
  );

  // Gọi API để lấy dữ liệu từ server
  const fetchDiscountData = async () => {
    setLoadingPage(true);
    try {
      const data = await DiscountService.getDiscounts();
      setDiscountData(data); // Lưu dữ liệu vào state
    } catch (err) {
      setErrorServer(err.message); // Lưu lỗi vào state nếu có
    } finally {
      setLoadingPage(false);
    }
  };

  // Gọi API khi component mount
  useEffect(() => {
    fetchDiscountData();
  }, []);

  // Hàm validate cho từng trường input
  const validateField = (key, value) => {
    let error = "";

    switch (key) {
      case "discountName":
        if (!value || value.trim() === "") {
          error = "Tên không được để trống.";
        }
        break;

      case "percentage":
        if (value === "" || value === null) {
          error = "Tỷ lệ giảm giá không được để trống.";
        } else if (isNaN(value) || value <= 0 || value > 100) {
          error = "Tỷ lệ giảm giá phải là một số từ lớn hơn 0 đến 100.";
        }
        break;

      case "startDate":
        if (!value) {
          error = "Ngày bắt đầu không được để trống.";
        }
        break;

      case "endDate":
        if (!value) {
          error = "Ngày kết thúc không được để trống.";
        } else if (new Date(value) < new Date(formData.startDate)) {
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

    if (!formData.discountName || formData.discountName.trim() === "") {
      newErrors.discountName = "Tên không được để trống.";
    }

    if (formData.percentage === "" || formData.percentage === null) {
      newErrors.percentage = "Tỷ lệ giảm giá không được để trống.";
    } else if (
      isNaN(formData.percentage) ||
      formData.percentage <= 0 ||
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
    } else if (new Date(formData.endDate) < new Date(formData.startDate)) {
      newErrors.endDate = "Ngày kết thúc phải sau ngày bắt đầu.";
    }

    setErrorFields(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Hàm xử lý khi thay đổi giá trị input
  const handleInputChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
    validateField(key, value);
  };

  const updateStatus = (newStatus) => {
    setStatusFunction(prevStatus => ({
      ...prevStatus,    // Giữ lại các thuộc tính trước đó
      ...newStatus      // Cập nhật các thuộc tính mới
    }));
  };
  const handleResetStatus = () => {
    updateStatus({ isAdd: true, isEditing: false, isViewDetail: false })
  };

  // Hàm reset form khi thêm mới
  const handleReset = () => {
    setFormData({
      discountName: "",
      percentage: "0",
      startDate: formatDateTimeLocal(), // Ngày hiện tại
      endDate: "",
      description: "",
    });
    handleResetStatus();
    setErrorFields({});
  };

  // Hàm gọi khi nhấn "Sửa" một hàng
  const handleEdit = (item) => {
    setFormData({
      ...item,
      startDate: formatDateTimeToISO(item.startDate),
      endDate: formatDateTimeToISO(item.endDate), //yyyy-MM-dd hh:mm:ss -> yyyy-DD-mmThh:mm
    });
    updateStatus({ isEditing: true })
    setErrorFields({});
  };

  const handleSaveItem = async () => {
    if (!validateForm()) return false;

    setIsLoading(true);

    try {
      if (statusFunction.isEditing) {
        // Gọi API cập nhật sử dụng discountService
        const updatedDiscount = await DiscountService.updateDiscount(
          formData.id,
          formData
        );

        // Đổi định dạng ngày giờ trước khi lưu vào mảng
        const formattedDiscount = {
          ...updatedDiscount,
          startDate: formatDateTimeToDMY(updatedDiscount.startDate),
          endDate: formatDateTimeToDMY(updatedDiscount.endDate),
        };

        // Cập nhật state discountData với discount đã được sửa
        const updatedDiscounts = discountData.map((discount) =>
          discount.id === formattedDiscount.id ? formattedDiscount : discount
        );

        setDiscountData(updatedDiscounts);
        toast.success("Cập nhật thành công!");
      } else if (statusFunction.isAdd) {
        // Nếu đang ở trạng thái thêm mới
        const newDiscount = await DiscountService.createDiscount(formData);

        // Đổi định dạng ngày giờ trước khi lưu vào mảng
        const formattedDiscount = {
          ...newDiscount,
          startDate: formatDateTimeToDMY(newDiscount.startDate),
          endDate: formatDateTimeToDMY(newDiscount.endDate),
        };

        // Cập nhật mảng discountData với item vừa được thêm
        setDiscountData([...discountData, formattedDiscount]);

        toast.success("Thêm mới thành công!");
      }

      handleReset();
      return true;
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data + "!"); // Hiển thị thông điệp lỗi từ server
      } else {
        toast.error("Đã xảy ra lỗi không xác định. Vui lòng thử lại sau!"); // Thông báo lỗi chung
       
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm xóa một discount
  const handleDelete = (deleteId) => {
    if (deleteId) {
      setIsLoading(true);
      DiscountService
        .deleteDiscount(deleteId)
        .then(() => {
          setDiscountData(
            discountData.filter((discount) => discount.id !== deleteId)
          );
          toast.success("Xóa thành công!");
        })
        .catch(() => {
          toast.error("Đã xảy ra lỗi khi xóa.");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const modalContent = (
    <>
      <div className="row">
        <div className="col-md-6 mb-3">
          <Form.Group controlId="formName">
            <Form.Label>Tên giảm giá <span className="text-danger">(*)</span></Form.Label>
            <Form.Control
              type="text"
              name="discountName"
              value={formData.discountName}
              maxLength={100}
              onChange={(e) =>
                handleInputChange("discountName", e.target.value)
              }
              isInvalid={!!errorFields.discountName}
              placeholder="Nhập vào tên giảm giá"
              required
            />
            <Form.Control.Feedback type="invalid">
              {errorFields.discountName}
            </Form.Control.Feedback>
          </Form.Group>
        </div>

        <div className="col-md-6 mb-3">
          <Form.Group controlId="formPercentage">
            <Form.Label>Tỷ lệ giảm giá (%) <span className="text-danger">(*)</span></Form.Label>
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
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <Form.Group controlId="formStartDate">
            <Form.Label>Ngày bắt đầu <span className="text-danger">(*)</span></Form.Label>
            <Form.Control
              type="datetime-local"
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
            <Form.Label>Ngày kết thúc <span className="text-danger">(*)</span></Form.Label>
            <Form.Control
              type="datetime-local"
              name="endDate"
              value={formData.endDate}
              onChange={(e) => handleInputChange("endDate", e.target.value)}
              isInvalid={!!errorFields.endDate}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errorFields.endDate}
            </Form.Control.Feedback>
          </Form.Group>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12 mb-3">
          <Form.Group controlId="formDescription">
            <Form.Label>Mô tả</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Viết mô tả cho giảm giá (nếu có)..."
            />
          </Form.Group>
        </div>
      </div>
    </>
  );

  return (
    <>
      <Helmet>
        <title>Quản lý giảm giá - Hight Star</title>
      </Helmet>
      {/* Hiển thị loader khi đang tải trang */}
      {loadingPage ? (
        <div className="w-100 h-100 d-flex justify-content-center align-items-center">
          <Spinner animation="border" className="text-primary" />
        </div>
      ) : errorServer ? (
        <Page500 message={errorServer} />
      ) : (
        <section className="row m-0 p-0 ">
          <TableManagement
            columns={discountColumns}
            data={discountData}
            title={"Quản lý giảm giá"}
            defaultColumns={defaultColumns} // Truyền mảng cột đã lọc
            modalContent={modalContent}
            handleReset={handleReset}
            onEdit={handleEdit}
            handleSaveItem={handleSaveItem}
            onDelete={handleDelete}
            isLoading={isLoading}
            statusFunction={statusFunction}
            onResetStatus={handleResetStatus}
          />
        </section>
      )}
    </>
  );
};

export default DiscountManagement;
