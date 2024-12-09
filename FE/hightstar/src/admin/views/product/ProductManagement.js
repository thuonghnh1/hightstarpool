import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import TableManagement from "../../components/common/TableManagement";
import ProductService from "../../services/ProductService"; // API service for product
import Page500 from "../../../common/pages/Page500";
import { Spinner, Form } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { formatDateTimeToDMY } from "../../utils/FormatDate";
import Select from "react-select";



const ProductManagement = () => {
  // State lưu dữ liệu sản phẩm
  const [productData, setProductData] = useState([]);
  const [formData, setFormData] = useState({});
  const [errorFields, setErrorFields] = useState({});
  const [statusFunction, setStatusFunction] = useState({
    isAdd: false,
    isEditing: false,
    isViewDetail: false,
  });
  const [categoryOptions, setCategoryOptions] = useState([]); // Assuming you have categories to associate with products
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(false);
  const [errorServer, setErrorServer] = useState(null);

  // Mảng cột của bảng sản phẩm
  const productColumns = [
    { key: "productId", label: "Mã sản phẩm" },
    { key: "productName", label: "Tên sản phẩm" },
    { key: "price", label: "Giá" },
    { key: "stock", label: "Số lượng tồn kho" },
    { key: "discount", label: "Giảm giá" },
    { key: "createdAt", label: "Ngày tạo" },
    { key: "updatedAt", label: "Ngày cập nhật" },
  ];

  // Hàm lấy tất cả sản phẩm
  const getProducts = async () => {
    setLoadingPage(true);
    try {
      const response = await ProductService.getProducts();
      const products = response.map((product) => ({
        ...product,
        createdAt: formatDateTimeToDMY(product.createdAt),
        updatedAt: formatDateTimeToDMY(product.updatedAt),
      }));
      setProductData(products);
    } catch (error) {
      setErrorServer(true);
      console.error("Error fetching products", error);
    } finally {
      setLoadingPage(false);
    }
  };

  // Hàm lấy danh mục sản phẩm
  const getCategories = async () => {
    try {
      const categories = await ProductService.getCategories(); // Assume a function to fetch categories
      setCategoryOptions(categories.map(cat => ({ value: cat.categoryId, label: cat.categoryName })));
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };

  // UseEffect để lấy dữ liệu khi component được mount
  useEffect(() => {
    getProducts();
    getCategories();
  }, []);

  // Hàm xử lý thay đổi dữ liệu trong form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (errorFields[name]) {
      setErrorFields({
        ...errorFields,
        [name]: null,
      });
    }
  };

  // Hàm xử lý thay đổi Select category
  const handleCategoryChange = (selectedOption) => {
    setFormData({
      ...formData,
      categoryId: selectedOption ? selectedOption.value : "",
    });
  };

  // Hàm thêm mới sản phẩm
  const handleAddProduct = async () => {
    if (validateForm()) {
      setIsLoading(true);
      try {
        await ProductService.createProduct(formData);
        toast.success("Sản phẩm đã được thêm!");
        resetForm();
        getProducts();
      } catch (error) {
        toast.error("Lỗi khi thêm sản phẩm!");
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Hàm sửa sản phẩm
  const handleEditProduct = async (id) => {
    setStatusFunction({ isEditing: true });
    const product = productData.find((item) => item.productId === id);
    setFormData({
      ...product,
      // createdAt: formatDateTimeToISO(product.createdAt),
      
    });
  };

  // Hàm lưu sửa sản phẩm
  const handleSaveProduct = async () => {
    if (validateForm()) {
      setIsLoading(true);
      try {
        await ProductService.updateProduct(formData.productId, formData);
        toast.success("Sản phẩm đã được cập nhật!");
        resetForm();
        getProducts();
      } catch (error) {
        toast.error("Lỗi khi cập nhật sản phẩm!");
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Hàm xóa sản phẩm
  const handleDeleteProduct = async (id) => {
    try {
      await ProductService.deleteProduct(id);
      toast.success("Sản phẩm đã được xóa!");
      getProducts();
    } catch (error) {
      toast.error("Lỗi khi xóa sản phẩm!");
    }
  };

  // Hàm kiểm tra tính hợp lệ của form
  const validateForm = () => {
    const errors = {};
    if (!formData.productName) errors.productName = "Tên sản phẩm là bắt buộc!";
    if (!formData.price) errors.price = "Giá là bắt buộc!";
    if (!formData.stock) errors.stock = "Số lượng tồn kho là bắt buộc!";
    if (!formData.categoryId) errors.categoryId = "Chọn danh mục sản phẩm!";
    setErrorFields(errors);
    return Object.keys(errors).length === 0;
  };

  // Hàm reset form
  const resetForm = () => {
    setFormData({});
    setErrorFields({});
    setStatusFunction({ isAdd: false, isEditing: false, isViewDetail: false });
  };

  // Hàm để render form
  const renderForm = () => (
    <Form>
      <Form.Group>
        <Form.Label>Tên sản phẩm</Form.Label>
        <Form.Control
          type="text"
          name="productName"
          value={formData.productName || ""}
          onChange={handleChange}
          isInvalid={!!errorFields.productName}
        />
        <Form.Control.Feedback type="invalid">{errorFields.productName}</Form.Control.Feedback>
      </Form.Group>
      <Form.Group>
        <Form.Label>Giá</Form.Label>
        <Form.Control
          type="number"
          name="price"
          value={formData.price || ""}
          onChange={handleChange}
          isInvalid={!!errorFields.price}
        />
        <Form.Control.Feedback type="invalid">{errorFields.price}</Form.Control.Feedback>
      </Form.Group>
      <Form.Group>
        <Form.Label>Số lượng tồn kho</Form.Label>
        <Form.Control
          type="number"
          name="stock"
          value={formData.stock || ""}
          onChange={handleChange}
          isInvalid={!!errorFields.stock}
        />
        <Form.Control.Feedback type="invalid">{errorFields.stock}</Form.Control.Feedback>
      </Form.Group>
      <Form.Group>
        <Form.Label>Danh mục sản phẩm</Form.Label>
        <Select
          options={categoryOptions}
          onChange={handleCategoryChange}
          value={categoryOptions.find((option) => option.value === formData.categoryId)}
        />
        {errorFields.categoryId && <div className="text-danger">{errorFields.categoryId}</div>}
      </Form.Group>
      <div className="d-flex justify-content-between">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={resetForm}
        >
          Hủy
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={statusFunction.isAdd ? handleAddProduct : handleSaveProduct}
          disabled={isLoading}
        >
          {statusFunction.isAdd ? "Thêm mới" : "Lưu"}
        </button>
      </div>
    </Form>
  );

  // Render khi có lỗi server
  if (errorServer) return <Page500 />;

  return (
    <div className="product-management">
      <Helmet>
        <title>Quản lý sản phẩm</title>
      </Helmet>
      <div className="d-flex justify-content-between mb-3">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setStatusFunction({ isAdd: true })}
        >
          Thêm sản phẩm
        </button>
      </div>
      {loadingPage ? (
        <Spinner animation="border" />
      ) : (
        <>
          <TableManagement
            data={productData}
            columns={productColumns}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
          />
          {statusFunction.isAdd || statusFunction.isEditing ? renderForm() : null}
        </>
      )}
    </div>
  );
};

export default ProductManagement;
