import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import TableManagement from "../../components/common/TableManagement";
import { NumericFormat } from "react-number-format";
import ProductService from "../../services/ProductService";
import Page500 from "../../../common/pages/Page500";
import { Helmet } from "react-helmet-async";
import { Spinner, Form } from "react-bootstrap";
import {
  formatDateTimeToDMY,
  formatDateTimeToISO,
} from "../../utils/FormatDate";

const ProductManagement = () => {
  // State để lưu trữ dữ liệu sản phẩm từ API
  const [productData, setProductData] = useState([]);
  const [formData, setFormData] = useState({}); // State quản lý dữ liệu hiện tại
  const [imageFile, setImageFile] = useState("");
  const [errorFields, setErrorFields] = useState({}); // State quản lý lỗi
  const [statusFunction, setStatusFunction] = useState({
    isAdd: false,
    isEditing: false,
    isViewDetail: false,
  }); // Trạng thái để biết đang thêm mới hay chỉnh sửa hay xem chi tiết
  // State để xử lý trạng thái tải dữ liệu và lỗi
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(false); // để load cho toàn bộ trang dữ liệu
  const [errorServer, setErrorServer] = useState(null);
  const button = {
    btnAdd: true,
    btnEdit: true,
    btnDelete: true,
    btnDetail: false,
    btnSetting: false,
  };

  // Mảng cột của bảng
  const productColumns = [
    { key: "id", label: "ID" },
    { key: "productName", label: "Tên sản phẩm" },
    { key: "image", label: "Hình Ảnh" },
    { key: "description", label: "Mô tả" },
    { key: "price", label: "Giá gốc" },
    { key: "discount", label: "Giảm giá (%)" },
    { key: "discountedPrice", label: "Giá KM" },
    { key: "stock", label: "Tổng trong kho" },
    { key: "categoryId", label: "Mã loại sản phẩm" },
    { key: "createdAt", label: "Ngày tạo" },
    { key: "updatedAt", label: "Ngày cập nhật" },
  ];

  // Loại bỏ một số cột không cần thiết khỏi discountColumns
  const keysToRemove = ["description", "createdAt", "updatedAt"];
  const defaultColumns = productColumns.filter(
    (column) => !keysToRemove.includes(column.key)
  );

  // Gọi API để lấy dữ liệu từ server
  const fetchProductData = async () => {
    setLoadingPage(true);
    try {
      const data = await ProductService.getProducts();
      const formatData = data.map((product) => ({
        ...product,
        discount: product.discount * 100,
        discountedPrice: product.price - product.price * product.discount,
        createdAt: formatDateTimeToDMY(product.createdAt),
        updatedAt: formatDateTimeToDMY(product.updatedAt),
      }));
      setProductData(formatData); // Lưu dữ liệu vào state
    } catch (err) {
      setErrorServer(err.message); // Lưu lỗi vào state nếu có
    } finally {
      setLoadingPage(false);
    }
  };

  // Gọi API khi component mount
  useEffect(() => {
    fetchProductData();
  }, []);

  // Hàm validate cho từng trường input
  const validateField = (key, value) => {
    let error = "";

    switch (key) {
      case "productName":
        if (!value || value.trim() === "") {
          error = "Tên không được để trống.";
        }
        break;

      case "discount":
        if (value === "" || value === null) {
          error = "Tỷ lệ giảm giá không được để trống.";
        } else if (isNaN(value) || value <= 0 || value > 100) {
          error = "Tỷ lệ giảm giá phải là một số từ lớn hơn 0 đến 100.";
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
      newErrors.productName = "Tên không được để trống.";
    }

    if (formData.discount === "" || formData.discount === null) {
      newErrors.discount = "Tỷ lệ giảm giá không được để trống.";
    } else if (
      isNaN(formData.discount) ||
      formData.discount <= 0 ||
      formData.discount > 100
    ) {
      newErrors.discount =
        "Tỷ lệ giảm giá phải là một số từ lớn hơn 0 đến 100.";
    }

    setErrorFields(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Hàm xử lý khi thay đổi giá trị input
  const handleInputChange = (key, value) => {
    let formatData = { ...formData, [key]: value };
    if (key === "discount") {
      formatData = {
        ...formData,
        discount: value / 100,
        discountedPrice:
          formData.price - formData.price * (value / 100 || 0) || "",
      };
    }
    if (key === "price") {
      formatData = {
        ...formData,
        [key]: value,
        discountedPrice: value - value * (formData.discount || 0) || "",
      };
    }
    setFormData({ ...formatData });
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
      productName: "",
      discount: "",
      description: "",
      image: "", // Thêm trường image nếu cần
      discountedPrice: "",
      price: "",
      stock: "",
      categoryId: "",
    });
    handleResetStatus();
    setErrorFields({});
  };

  // Hàm gọi khi nhấn "Sửa" một hàng
  const handleEdit = (item) => {
    setFormData({
      ...item,
      image: item.image || "", // Đảm bảo trường image tồn tại
      discount: item.discount / 100,
      createdAt: formatDateTimeToISO(item.createdAt),
      updatedAt: formatDateTimeToISO(item.updatedAt),
    });
    updateStatus({ isEditing: true });
    setErrorFields({});
  };

  const handleSaveItem = async () => {
    if (!validateForm()) return false;

    setIsLoading(true);

    try {
      if (statusFunction.isEditing) {
        // Gọi API cập nhật sử dụng ProductService
        const updatedProduct = await ProductService.updateProduct(
          formData.id,
          formData,
          imageFile
        );

        const formattedProduct = {
          ...updatedProduct,
          discount: updatedProduct.discount * 100,
          createdAt: formatDateTimeToDMY(updatedProduct.createdAt),
          updatedAt: formatDateTimeToDMY(updatedProduct.updatedAt),
        };

        // Cập nhật state productData với product đã được sửa
        const updatedProducts = productData.map((product) =>
          product.id === formattedProduct.id ? formattedProduct : product
        );

        setProductData(updatedProducts);
        toast.success("Cập nhật thành công!");
      } else if (statusFunction.isAdd) {
        // Nếu đang ở trạng thái thêm mới
        const newDiscount = await ProductService.createProduct(
          formData,
          imageFile
        );

        // Đổi định dạng ngày giờ trước khi lưu vào mảng
        const formattedProduct = {
          ...newDiscount,
          discount: newDiscount.discount * 100,
          createdAt: formatDateTimeToDMY(newDiscount.createdAt),
          updatedAt: formatDateTimeToDMY(newDiscount.updatedAt),
        };

        // Cập nhật mảng productData với item vừa được thêm
        setProductData([...productData, formattedProduct]);

        toast.success("Thêm mới thành công!");
      }

      handleReset();
      return true;
    } catch (error) {
      console.log(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (deleteId) => {
    if (!deleteId) return; // kiểm tra sớm

    setIsLoading(true);
    try {
      await ProductService.deleteDiscount(deleteId); // Thực hiện xóa
      setProductData((prevData) =>
        prevData.filter((product) => product.id !== deleteId)
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
        <div className="col-md-6 mb-3">
          {/* Phần hiển thị hình ảnh */}
          <Form.Label>Hình ảnh khóa học</Form.Label>
          <div
            className="d-flex justify-content-center align-items-center mb-3 rounded bg-light"
            style={{
              width: "100%",
              height: "240px",
              overflow: "hidden",
              border: "2px dashed #ddd",
            }}
          >
            {formData.image ? (
              <img
                src={formData.image}
                alt="Hình ảnh khóa học"
                className="w-100 h-100 object-fit-cover rounded"
              />
            ) : (
              <span className="text-muted">Chưa có hình ảnh nào</span>
            )}
          </div>
          <Form.Group controlId="formImage">
            <Form.Control
              type="file"
              name="image"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];

                if (file) {
                  setImageFile(file); // lưu file vào imgFile để guwỉ lên server
                  const fileUrl = URL.createObjectURL(file);
                  handleInputChange("image", fileUrl); // lưu file vào img để xem trước
                } else {
                  // Nếu người dùng xóa hình ảnh đã chọn thì xóa cả image và imageFile
                  handleInputChange("image", "");
                  setImageFile("");
                }
              }}
              isInvalid={!!errorFields.image}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errorFields.image}
            </Form.Control.Feedback>
          </Form.Group>
        </div>

        <div className="col-md-6 mb-3">
          <Form.Group controlId="formName">
            <Form.Label>
              Tên sản phẩm <span className="text-danger">(*)</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="productName"
              value={formData.productName}
              maxLength={100}
              onChange={(e) => handleInputChange("productName", e.target.value)}
              isInvalid={!!errorFields.productName}
              placeholder="Nhập vào tên sản phẩm"
              required
            />
            <Form.Control.Feedback type="invalid">
              {errorFields.productName}
            </Form.Control.Feedback>
          </Form.Group>
        </div>

        <div className="col-md-6 mb-3">
          <Form.Group controlId="formDiscount">
            <Form.Label>
              Tỷ lệ giảm giá (%) <span className="text-danger">(*)</span>
            </Form.Label>
            <Form.Control
              type="number"
              name="discount"
              min={0}
              step={1}
              max={100}
              value={formData.discount * 100 || ""}
              onChange={(e) => handleInputChange("discount", e.target.value)}
              isInvalid={!!errorFields.discount}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errorFields.discount}
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
              value={formData.description || ""}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Viết mô tả cho sản phẩm (nếu có)..."
            />
          </Form.Group>
        </div>
      </div>
      <div className="mb-3 p-0">
        <Form.Group controlId="formPrice">
          <Form.Label>Giá gốc</Form.Label>
          <NumericFormat
            thousandSeparator={true}
            suffix=" VNĐ"
            decimalScale={0} // Không cho phép số thập phân
            value={formData.price}
            onValueChange={(values) => {
              const { floatValue } = values;
              handleInputChange("price", floatValue); // Lấy giá trị số thực (floatValue là giá trị số thực không có dấu phân cách hay định dạng   )
            }}
            className="form-control"
            placeholder="Nhập giá (VNĐ)"
            required
          />
          <Form.Control.Feedback type="invalid">
            {errorFields.price}
          </Form.Control.Feedback>
        </Form.Group>
      </div>

      <div className="mb-3 p-0">
        <Form.Group controlId="discountPrice">
          <Form.Label>Giá KM</Form.Label>
          <NumericFormat
            thousandSeparator={true}
            suffix=" VNĐ"
            decimalScale={0} // Không cho phép số thập phân
            value={formData.discountedPrice}
            className="form-control"
            placeholder="Nhập giá (VNĐ)"
            required
            readOnly
          />
          <Form.Control.Feedback type="invalid">
            {errorFields.discountedPrice}
          </Form.Control.Feedback>
        </Form.Group>
      </div>

      <div className="col-md-6 mb-3">
        <Form.Group controlId="formDiscount">
          <Form.Label>
            Tổng Số lượng<span className="text-danger">(*)</span>
          </Form.Label>
          <Form.Control
            type="number"
            name="stock"
            min={0}
            step={1}
            value={formData.stock}
            onChange={(e) => handleInputChange("stock", e.target.value)}
            isInvalid={!!errorFields.stock}
            required
          />
          <Form.Control.Feedback type="invalid">
            {errorFields.stock}
          </Form.Control.Feedback>
        </Form.Group>
      </div>

      <div className="col-md-6 mb-3">
        <Form.Group controlId="formCategory">
          <Form.Label>
            Loại sản phẩm<span className="text-danger">(*)</span>
          </Form.Label>
          <Form.Control
            type="number"
            name="categoryId"
            min={0}
            step={1}
            value={formData.categoryId}
            onChange={(e) => handleInputChange("categoryId", e.target.value)}
            isInvalid={!!errorFields.categoryId}
            required
          />
          <Form.Control.Feedback type="invalid">
            {errorFields.categoryId}
          </Form.Control.Feedback>
        </Form.Group>
      </div>
    </>
  );

  return (
    <>
      <Helmet>
        <title>Quản lý sản phẩm - Hight Star</title>
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
            columns={productColumns}
            data={productData}
            title={"Quản lý sản phẩm"}
            defaultColumns={defaultColumns} // Truyền mảng cột đã lọc
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
};

export default ProductManagement;
