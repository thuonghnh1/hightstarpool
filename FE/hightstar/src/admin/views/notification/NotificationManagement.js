import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import TableManagement from "../../components/common/TableManagement";
import ProductService from "../../services/ProductService"; // API service cho sản phẩm
import CategoryService from "../../services/CategoryService"; // API service cho danh mục
import Page500 from "../../../common/pages/Page500";
import { Spinner, Form } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import Select from "react-select"; // thư viện tạo select có hỗ trợ search
import { formatDateTimeToDMY, formatDateTimeToISO } from "../../utils/FormatDate";

const ProductManagement = () => {
  // State lưu data từ API
  const [productData, setProductData] = useState([]);
  const [formData, setFormData] = useState({
    productId: null,
    productName: "",
    productImage: "",
    description: "",
    price: "",
    stock: "",
    discount: "",
    categoryId: "",
  });
  const [errorFields, setErrorFields] = useState({});
  const [statusFunction, setStatusFunction] = useState({
    isAdd: false,
    isEditing: false,
    isViewDetail: false,
  });
  const [listCategoryOption, setListCategoryOption] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(false);
  const [errorServer, setErrorServer] = useState(null);

  // Mảng cột của bảng
  const productColumns = [
    { key: "productId", label: "Mã sản phẩm" },
    { key: "productName", label: "Tên sản phẩm" },
    { key: "price", label: "Giá" },
    { key: "stock", label: "Số lượng tồn kho" },
    { key: "discount", label: "Giảm giá (%)" },
    { key: "categoryName", label: "Danh mục" }, // Hiển thị tên danh mục thay vì ID
    { key: "createdAt", label: "Ngày tạo" },
    { key: "updatedAt", label: "Ngày cập nhật" },
  ];

  // Loại bỏ các cột không cần thiết nếu muốn (ví dụ: productImage, description)
  const defaultColumns = productColumns.filter(
    (column) => column.key !== "productImage" && column.key !== "description"
  );

  // Lấy dữ liệu từ API
  const fetchProductData = async () => {
    setLoadingPage(true);
    try {
      // Lấy danh sách sản phẩm
      const products = await ProductService.getProducts();
      // Định dạng ngày tháng
      const formattedProducts = products.map((product) => ({
        ...product,
        createdAt: formatDateTimeToDMY(product.createdAt),
        updatedAt: formatDateTimeToDMY(product.updatedAt),
      }));
      setProductData(formattedProducts);
    } catch (err) {
      setErrorServer(err.message || "Lỗi khi tải dữ liệu sản phẩm.");
    } finally {
      setLoadingPage(false);
    }

    try {
      // Lấy danh sách danh mục
      const categories = await CategoryService.getCategories();
      // Chuyển đổi danh sách danh mục thành định dạng phù hợp cho Select
      const categoryOptions = categories.map((category) => ({
        value: category.categoryId,
        label: category.categoryName,
      }));
      setListCategoryOption(categoryOptions);
    } catch (error) {
      toast.error("Lỗi khi lấy danh sách danh mục");
    }
  };

  useEffect(() => {
    fetchProductData();
  }, []);

  // Hàm validate từng trường
  const validateField = (key, value) => {
    let error = "";
    switch (key) {
      case "productName":
        if (!value || value.trim() === "") {
          error = "Tên sản phẩm không được để trống.";
        }
        break;
      case "price":
        if (!value || isNaN(value) || Number(value) < 0) {
          error = "Giá phải là số dương.";
        }
        break;
      case "stock":
        if (!value || isNaN(value) || Number(value) < 0 || !Number.isInteger(Number(value))) {
          error = "Số lượng tồn kho phải là số nguyên không âm.";
        }
        break;
      case "discount":
        if (value !== "" && (isNaN(value) || Number(value) < 0 || Number(value) > 100)) {
          error = "Giảm giá phải là số từ 0 đến 100.";
        }
        break;
      case "categoryId":
        if (!value) {
          error = "Danh mục không được để trống.";
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
    if (!formData.productName || formData.productName.trim() === "") {
      newErrors.productName = "Tên sản phẩm không được để trống.";
    }
    if (!formData.price || isNaN(formData.price) || Number(formData.price) < 0) {
      newErrors.price = "Giá phải là số dương.";
    }
    if (
      formData.stock === "" ||
      isNaN(formData.stock) ||
      Number(formData.stock) < 0 ||
      !Number.isInteger(Number(formData.stock))
    ) {
      newErrors.stock = "Số lượng tồn kho phải là số nguyên không âm.";
    }
    if (
      formData.discount !== "" &&
      (isNaN(formData.discount) || Number(formData.discount) < 0 || Number(formData.discount) > 100)
    ) {
      newErrors.discount = "Giảm giá phải là số từ 0 đến 100.";
    }
    if (!formData.categoryId) {
      newErrors.categoryId = "Danh mục không được để trống.";
    }

    setErrorFields(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Hàm xử lý thay đổi input trong form
  const handleInputChange = (key, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [key]: value,
    }));

    validateField(key, value);
  };

  // Hàm cập nhật trạng thái chức năng (isAdd, isEditing, isViewDetail)
  const updateStatus = (newStatus) => {
    setStatusFunction((prevStatus) => ({
      ...prevStatus, // Giữ lại các thuộc tính trước đó
      ...newStatus, // Cập nhật các thuộc tính mới
    }));
  };

  // Hàm reset trạng thái chức năng
  const handleResetStatus = () => {
    updateStatus({ isAdd: false, isEditing: false, isViewDetail: false });
  };

  // Hàm reset form
  const handleReset = () => {
    setFormData({
      productId: null,
      productName: "",
      productImage: "",
      description: "",
      price: "",
      stock: "",
      discount: "",
      categoryId: "",
    });
    setErrorFields({});
    handleResetStatus();
  };

  // Hàm xử lý khi nhấn chỉnh sửa sản phẩm
  const handleEdit = (item) => {
    console.log(item);
    const updatedFormData = {
      ...item,
      createdAt: formatDateTimeToISO(item.createdAt),
      updatedAt: formatDateTimeToISO(item.updatedAt),
    };
    setFormData(updatedFormData);
    setStatusFunction({ isAdd: false, isEditing: true, isViewDetail: false });
    setErrorFields({});
  };

  // Hàm lưu sản phẩm (thêm mới hoặc chỉnh sửa)
  const handleSaveItem = async () => {
    if (!validateForm()) return false;

    setIsLoading(true);
    try {
      if (statusFunction.isEditing) {
        const updatedProduct = await ProductService.updateProduct(
          formData.productId,
          formData
        );
        const formattedProduct = {
          ...updatedProduct,
          createdAt: formatDateTimeToDMY(updatedProduct.createdAt),
          updatedAt: formatDateTimeToDMY(updatedProduct.updatedAt),
        };

        const updatedProducts = productData.map((product) =>
          product.productId === formattedProduct.productId
            ? formattedProduct
            : product
        );
        setProductData(updatedProducts);
        toast.success("Cập nhật sản phẩm thành công!");
      } else if (statusFunction.isAdd) {
        const createdProduct = await ProductService.createProduct(formData);
        const formattedProduct = {
          ...createdProduct,
          createdAt: formatDateTimeToDMY(createdProduct.createdAt),
          updatedAt: formatDateTimeToDMY(createdProduct.updatedAt),
        };
        setProductData([...productData, formattedProduct]);
        toast.success("Thêm mới sản phẩm thành công!");
      }
      handleReset();
      return true;
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi lưu sản phẩm.");
      console.error(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm xử lý xóa sản phẩm
  const handleDelete = async (deleteId) => {
    if (!deleteId) return;

    setIsLoading(true);
    try {
      await ProductService.deleteProduct(deleteId);
      setProductData(
        productData.filter((product) => product.productId !== deleteId)
      );
      toast.success("Xóa sản phẩm thành công!");
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi xóa sản phẩm.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Nội dung modal (form thêm/chỉnh sửa sản phẩm)
  const modalContent = (
    <div className="row">
      <div className="col-md-12 mb-3">
        <Form.Group controlId="formProductName">
          <Form.Label>Tên sản phẩm</Form.Label>
          <Form.Control
            type="text"
            name="productName"
            value={formData.productName}
            onChange={(e) => handleInputChange("productName", e.target.value)}
            isInvalid={!!errorFields.productName}
          />
          <Form.Control.Feedback type="invalid">
            {errorFields.productName}
          </Form.Control.Feedback>
        </Form.Group>
      </div>

      <div className="col-md-12 mb-3">
        <Form.Group controlId="formProductImage">
          <Form.Label>Hình ảnh sản phẩm</Form.Label>
          <Form.Control
            type="text"
            name="productImage"
            value={formData.productImage}
            onChange={(e) => handleInputChange("productImage", e.target.value)}
            placeholder="Nhập URL hình ảnh hoặc đường dẫn"
          />
        </Form.Group>
      </div>

      <div className="col-md-12 mb-3">
        <Form.Group controlId="formDescription">
          <Form.Label>Mô tả</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="description"
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
          />
        </Form.Group>
      </div>

      <div className="col-md-6 mb-3">
        <Form.Group controlId="formPrice">
          <Form.Label>Giá</Form.Label>
          <Form.Control
            type="number"
            name="price"
            value={formData.price}
            onChange={(e) => handleInputChange("price", e.target.value)}
            isInvalid={!!errorFields.price}
          />
          <Form.Control.Feedback type="invalid">
            {errorFields.price}
          </Form.Control.Feedback>
        </Form.Group>
      </div>

      <div className="col-md-6 mb-3">
        <Form.Group controlId="formStock">
          <Form.Label>Số lượng tồn kho</Form.Label>
          <Form.Control
            type="number"
            name="stock"
            value={formData.stock}
            onChange={(e) => handleInputChange("stock", e.target.value)}
            isInvalid={!!errorFields.stock}
          />
          <Form.Control.Feedback type="invalid">
            {errorFields.stock}
          </Form.Control.Feedback>
        </Form.Group>
      </div>

      <div className="col-md-6 mb-3">
        <Form.Group controlId="formDiscount">
          <Form.Label>Giảm giá (%)</Form.Label>
          <Form.Control
            type="number"
            name="discount"
            value={formData.discount}
            onChange={(e) => handleInputChange("discount", e.target.value)}
            isInvalid={!!errorFields.discount}
          />
          <Form.Control.Feedback type="invalid">
            {errorFields.discount}
          </Form.Control.Feedback>
        </Form.Group>
      </div>

      <div className="col-md-6 mb-3">
        <Form.Group controlId="formCategory">
          <Form.Label>Danh mục</Form.Label>
          <Select
            options={listCategoryOption}
            value={listCategoryOption.find(
              (option) => option.value === formData.categoryId
            )}
            onChange={(selectedOption) =>
              handleInputChange(
                "categoryId",
                selectedOption ? selectedOption.value : ""
              )
            }
            placeholder="Chọn danh mục"
            isInvalid={!!errorFields.categoryId}
            isClearable // Cho phép xóa chọn lựa
            isSearchable // Bật tính năng tìm kiếm
            styles={{
              menu: (provided) => ({
                ...provided,
              }),
            }}
          />
          {errorFields.categoryId && (
            <div className="invalid-feedback d-block">
              {errorFields.categoryId}
            </div>
          )}
        </Form.Group>
      </div>

      <div className="small fst-italic text-danger mb-3">
        Lưu ý: Các trường không bắt buộc có thể để trống!
      </div>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Quản lý sản phẩm - Hight Star</title>
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
            data={productData}
            columns={productColumns}
            defaultColumns={defaultColumns} // Truyền mảng cột đã lọc
            title={"Quản lý sản phẩm"}
            modalContent={modalContent}
            handleReset={handleReset}
            onEdit={handleEdit}
            handleSaveItem={handleSaveItem}
            onDelete={handleDelete}
            isLoading={isLoading}
            statusFunction={statusFunction}
            onResetStatus={handleResetStatus}
            showAddButton={() => updateStatus({ isAdd: true, isEditing: false, isViewDetail: false })}
          />
        </section>
      )}
    </>
  );
};

export default ProductManagement;
