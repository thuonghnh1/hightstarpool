import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import TableManagement from "../../components/common/TableManagement";
import CategoryService from "../../services/CategoryService";
import Page500 from "../../../common/pages/Page500";
import { Helmet } from "react-helmet-async";
import { Spinner, Form } from "react-bootstrap";

const CategoryManagement = () => {
  // State để lưu trữ dữ liệu giảm giá từ API
  const [categoryData, setCategoryData] = useState([]);
  const [formData, setFormData] = useState({}); // State quản lý dữ liệu hiện tại
  const [errorFields, setErrorFields] = useState({}); // State quản lý lỗi
  const [statusFunction, setStatusFunction] = useState({
    isAdd: false,
    isEditing: false,
    isViewDetail: false,
  }); // Trạng thái để biết đang thêm mới hay chỉnh sửa hay xem chi tiết
  // State để xử lý trạng thái tải dữ liệu và lỗi
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(false); // này để load cho toàn bộ trang dữ liệu
  const [errorServer, setErrorServer] = useState(null);
  const button = {
    btnAdd: true,
    btnEdit: true,
    btnDelete: true,
    btnDetail: false,
    btnSetting: false,
  };
  // Mảng cột của bảng
  const categoryColumns = [
    { key: "id", label: "ID" },
    { key: "categoryName", label: "Tên giảm giá" },
  ];

  // Gọi API để lấy dữ liệu từ server
  const fetchCategoryData = async () => {
    setLoadingPage(true);
    try {
      const data = await CategoryService.getCategories();
      setCategoryData(data); // Lưu dữ liệu vào state
    } catch (err) {
      setErrorServer(err.message); // Lưu lỗi vào state nếu có
    } finally {
      setLoadingPage(false);
    }
  };

  useEffect(() => {
    fetchCategoryData();
  }, []);

  const validateField = (key, value) => {
    let error = "";
    switch (key) {
      case "categoryName":
        if (!value || value.trim() === "") {
          error = "Tên không được để trống.";
        }
        break;

      default:
        break;
    }
    setErrorFields((prevErrors) => ({
      ...prevErrors,
      [key]: error,
    }));
  }
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

  const updateStatus = (newStatus) => {
    setStatusFunction((prevStatus) => ({
      ...prevStatus, // Giữ lại các thuộc tính trước đó
      ...newStatus, // Cập nhật các thuộc tính mới
    }));
  };
  const handleResetStatus = () => {
    updateStatus({ isAdd: true, isEditing: false, isViewDetail: false });
  };

  // Hàm reset form khi thêm mới
  const handleReset = () => {
    setFormData({
      categoryName: "",

    });
    handleResetStatus();
    setErrorFields({});
  };

  const handleEdit = (item) => {
    setFormData({
      ...item,
    });
    updateStatus({ isEditing: true });
    setErrorFields({});
  };
  const handleSaveItem = async () => {
    if (!validateForm()) return false;

    setIsLoading(true);

    try {
      if (statusFunction.isEditing) {
        // Gọi API cập nhật sử dụng CategoryService
        const updatedCategory = await CategoryService.updateCategory(
          formData.id,
          formData
        );



        // Cập nhật state CategoryData với Category đã được sửa
        const updateCategorydData = categoryData.map((category) =>
          category.id === updatedCategory.id ? updatedCategory : category
        );

        setCategoryData(updateCategorydData);
        toast.success("Cập nhật thành công!");
      } else if (statusFunction.isAdd) {
        // Nếu đang ở trạng thái thêm mới
        const newCategory = await CategoryService.createCategory(formData);

        // Cập nhật mảng CategoryData với item vừa được thêm
        setCategoryData([...categoryData, newCategory]);

        toast.success("Thêm mới thành công!");
      }

      handleReset();
      return true;
    } catch (error) {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (deleteId) => {
    if (!deleteId) return; // kiểm tra sớm

    setIsLoading(true);
    try {
      await CategoryService.deleteCategory(deleteId); // Thực hiện xóa
      setCategoryData((prevData) =>
        prevData.filter((category) => category.id !== deleteId)
      );
      toast.success("Xóa thành công!");
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi xóa.");
    } finally {
      setIsLoading(false); // Đảm bảo tắt loading trong mọi trường hợp
    }
  };

  const modalContent = (
    <>
      <div className="row">
        <div className="col-md-12 mb-3">
          <Form.Group controlId="formName">
            <Form.Label>
              Tên danh mục <span className="text-danger">(*)</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="categoryName"
              value={formData.categoryName}
              maxLength={100}
              onChange={(e) =>
                handleInputChange("categoryName", e.target.value)
              }
              isInvalid={!!errorFields.categoryName}
              placeholder="Nhập vào tên giảm giá"
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
        <title>Quản lý phân loại - Hight Star</title>
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
            title={"Quản lý giảm giá"}
            defaultColumns={categoryColumns}
            modalContent={modalContent}
            handleReset={handleReset}
            onEdit={handleEdit}
            handleSaveItem={handleSaveItem}
            onDelete={handleDelete}
            isLoading={isLoading}
            statusFunction={statusFunction}
            onResetStatus={handleResetStatus}
            buttonCustom={button}
          />
        </section>
      )}
    </>
  );

}

export default CategoryManagement;
