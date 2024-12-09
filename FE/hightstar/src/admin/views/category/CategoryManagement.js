import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import TableManagement from "../../components/common/TableManagement";
import CategoryService from "../../services/CategoryService";
import Page500 from "../../../common/pages/Page500";
import { Spinner, Form } from "react-bootstrap";
import { Helmet } from "react-helmet-async";


const CategoryManagement = () => {
  // State lưu data từ API
  const [categoryData, setCategoryData] = useState([]);
  const [formData, setFormData] = useState({});
  const [errorFields, setErrorFields] = useState({});
  const [statusFunction, setStatusFunction] = useState({
    isAdd: false,
    isEditing: false,
    isViewDetail: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(false);
  const [errorServer, setErrorServer] = useState(null);

  // Mảng cột của bảng
  const categoryColumns = [
    { key: "id", label: "Mã danh mục" },
    { key: "categoryName", label: "Tên danh mục" },
  ];

  // Lấy dữ liệu từ API
  const fetchCategoryData = async () => {
    setLoadingPage(true);
    try {
      const data = await CategoryService.getCategories();
      setCategoryData(data);
    } catch (err) {
      setErrorServer(err.message);
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

  const validateForm = () => {
    const newErrors = {};
    if (!formData.categoryName || formData.categoryName.trim() === "") {
      newErrors.categoryName = "Tên danh mục không được để trống.";
    }
    setErrorFields(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (key, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [key]: value,
    }));
    validateField(key, value);
  };

  const updateStatus = (newStatus) => {
    setStatusFunction((prevStatus) => ({
      ...prevStatus,
      ...newStatus,
    }));
  };

  const handleResetStatus = () => {
    updateStatus({ isAdd: true, isEditing: false, isViewDetail: false });
  };

  const handleReset = () => {
    setFormData({
      categoryName: "",
    });
    setErrorFields({});
    handleResetStatus();
  };

  const handleEdit = (item) => {
    setFormData(item);
    setStatusFunction({ isEditing: true });
    setErrorFields({});
  };

  const handleSaveItem = async () => {
    if (!validateForm()) return false;

    setIsLoading(true);
    try {
      if (statusFunction.isEditing) {
        const updatedCategory = await CategoryService.updateCategory(
          formData.id,
          formData
        );
        const updatedCategories = categoryData.map((category) =>
          category.id === updatedCategory.id
            ? updatedCategory
            : category
        );
        setCategoryData(updatedCategories);
        toast.success("Cập nhật danh mục thành công!");
      } else if (statusFunction.isAdd) {
        const createdCategory = await CategoryService.createCategory(formData);
        setCategoryData([...categoryData, createdCategory]);
        toast.success("Thêm mới danh mục thành công!");
      }
      handleReset();
      return true;
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi lưu danh mục.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (deleteId) => {
    if (!deleteId) return;

    setIsLoading(true);
    try {
      await CategoryService.deleteCategory(deleteId);
      setCategoryData(
        categoryData.filter((category) => category.id !== deleteId)
      );
      toast.success("Xóa danh mục thành công!");
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi xóa danh mục.");
    } finally {
      setIsLoading(false);
    }
  };

  const modalContent = (
    <div className="row">
      <div className="col-md-12 mb-3">
        <Form.Group controlId="formCategoryName">
          <Form.Label>Tên danh mục</Form.Label>
          <Form.Control
            type="text"
            name="categoryName"
            value={formData.categoryName}
            onChange={(e) => handleInputChange("categoryName", e.target.value)}
            isInvalid={!!errorFields.categoryName}
          />
          <Form.Control.Feedback type="invalid">
            {errorFields.categoryName}
          </Form.Control.Feedback>
        </Form.Group>
      </div>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Quản lý danh mục - High Star</title>
      </Helmet>
      {loadingPage ? (
        <div className="w-100 h-100 d-flex justify-content-center align-items-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : errorServer ? (
        <Page500 message={errorServer} />
      ) : (
        <section className="row m-0 p-0">
          <TableManagement
            data={categoryData}
            columns={categoryColumns}
            title={"Quản lý danh mục"}
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

export default CategoryManagement;
