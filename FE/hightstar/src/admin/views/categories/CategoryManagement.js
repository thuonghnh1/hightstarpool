import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import TableManagement from "../../components/common/TableManagement";
import categoryService from "../../services/CategoryService"; // Bạn cần xây dựng dịch vụ này
import Page500 from "../pages/Page500";
import { Helmet } from "react-helmet-async";
import { Spinner, Form } from "react-bootstrap";

const CategoryManagement = () => {
  // State để lưu trữ dữ liệu danh mục từ API
  const [categoryData, setCategoryData] = useState([]);
  const [formData, setFormData] = useState({}); // State quản lý dữ liệu hiện tại
  const [errorFields, setErrorFields] = useState({}); // State quản lý lỗi
  const [isEditing, setIsEditing] = useState(false); // Trạng thái để biết đang thêm mới hay chỉnh sửa
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(false); // này để load cho toàn bộ trang dữ liệu
  const [errorServer, setErrorServer] = useState(null);

  // Mảng cột của bảng
  const categoryColumns = [
    { key: "categoryId", label: "ID" },
    { key: "categoryName", label: "Tên Danh Mục" },
  ];

  // Loại bỏ một số cột không cần thiết khỏi categoryColumns
  const keysToRemove = [];
  const defaultColumns = categoryColumns.filter(
    (column) => !keysToRemove.includes(column.key)
  );

  // Gọi API để lấy dữ liệu từ server
  const fetchCategoryData = async () => {
    setLoadingPage(true);
    try {
      const data = await categoryService.getCategories(); // Lấy dữ liệu từ service
      setCategoryData(data); // Lưu dữ liệu vào state
    } catch (err) {
      setErrorServer(err.message); // Lưu lỗi vào state nếu có
    } finally {
      setLoadingPage(false);
    }
  };

  // Gọi API khi component mount
  useEffect(() => {
    fetchCategoryData();
  }, []);

  // Hàm validate cho từng trường input
  const validateField = (key, value) => {
    let error = "";

    switch (key) {
      case "categoryName":
        if (!value || value.trim() === "") {
          error = "Tên danh mục không được để trống.";
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

    if (!formData.categoryName || formData.categoryName.trim() === "") {
      newErrors.categoryName = "Tên danh mục không được để trống.";
    }

    setErrorFields(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Hàm xử lý khi thay đổi giá trị input
  const handleInputChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
    validateField(key, value);
  };

  // Hàm reset form khi thêm mới
  const handleReset = () => {
    setFormData({
      categoryName: "",
    });
    setIsEditing(false);
    setErrorFields({});
  };

  // Hàm gọi khi nhấn "Sửa" một hàng
  const handleEdit = (item) => {
    setFormData({
      ...item,
    });
    setIsEditing(true);
    setErrorFields({});
  };

  const handleSaveItem = async () => {
    if (!validateForm()) return false;

    setIsLoading(true);

    try {
      if (isEditing) {
        // Cập nhật danh mục
        const updatedCategory = await categoryService.updateCategory(
          formData.categoryId,
          formData
        );

        // Cập nhật lại dữ liệu trong state
        const updatedCategories = categoryData.map((category) =>
          category.categoryId === updatedCategory.categoryId ? updatedCategory : category
        );

        setCategoryData(updatedCategories);
        toast.success("Cập nhật thành công!");
      } else {
        // Thêm mới danh mục
        const newCategory = await categoryService.createCategory(formData);

        // Thêm mới vào mảng dữ liệu
        setCategoryData([...categoryData, newCategory]);

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

  // Hàm xóa một danh mục
  const handleDelete = (deleteId) => {
    if (deleteId) {
      setIsLoading(true);
      categoryService
        .deleteCategory(deleteId)
        .then(() => {
          setCategoryData(
            categoryData.filter((category) => category.categoryId !== deleteId)
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
        <div className="col-md-12 mb-3">
          <Form.Group controlId="formCategoryName">
            <Form.Label>Tên Danh Mục <span className="text-danger">(*)</span></Form.Label>
            <Form.Control
              type="text"
              name="categoryName"
              value={formData.categoryName}
              maxLength={100}
              onChange={(e) =>
                handleInputChange("categoryName", e.target.value)
              }
              isInvalid={!!errorFields.categoryName}
              placeholder="Nhập vào tên danh mục"
              required
            />
            <Form.Control.Feedback type="invalid">
              {errorFields.categoryName}
            </Form.Control.Feedback>
          </Form.Group>
        </div>
      </div>
    </>
  );

  return (
    <>
      <Helmet>
        <title>Quản lý danh mục - Hight Star</title>
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
            columns={categoryColumns}
            data={categoryData}
            title={"Quản lý danh mục"}
            defaultColumns={defaultColumns} // Truyền mảng cột đã lọc
            modalContent={modalContent}
            isEditing={isEditing}
            handleReset={handleReset}
            onEdit={handleEdit}
            handleSaveItem={handleSaveItem}
            onDelete={handleDelete}
            isLoading={isLoading}
          />
        </section>
      )}
    </>
  );
};

export default CategoryManagement;
