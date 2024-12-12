// import { useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import { Spinner, Form, Button, Modal } from "react-bootstrap";
// import CategoryService from "../../services/CategoryService"; // Import CategoryService
// import TableManagement from "../../components/common/TableManagement";
// import Page500 from "../../../common/pages/Page500"; // Nếu cần sử dụng Page500
// import { Helmet } from "react-helmet-async";

// const CategoryManagement = () => {
//   // State lưu dữ liệu từ API
//   const [categoryData, setCategoryData] = useState([]);
//   const [formData, setFormData] = useState({
//     categoryId: null,
//     categoryName: "",
//   }); // State quản lý dữ liệu hiện tại
//   const [statusFunction, setStatusFunction] = useState({
//     isAdd: false,
//     isEditing: false,
//     isViewDetail: false,
//   }); // Trạng thái để biết đang thêm mới hay chỉnh sửa hay xem chi tiết
//   const [isLoading, setIsLoading] = useState(false); // State để xử lý trạng thái tải dữ liệu
//   const [loadingPage, setLoadingPage] = useState(false); // Để load cho toàn bộ trang dữ liệu
//   const [showModal, setShowModal] = useState(false); // State để điều khiển modal thêm/sửa
//   const [showConfirmModal, setShowConfirmModal] = useState(false); // State để điều khiển modal xác nhận xóa
//   const [deleteId, setDeleteId] = useState(null); // ID của item cần xóa

//   // Mảng cột của bảng
//   const categoryColumns = [
//     { key: "categoryId", label: "Mã danh mục" },
//     { key: "categoryName", label: "Tên danh mục" },
//   ];

//   // Mảng cột mặc định hiển thị
//   const defaultColumns = categoryColumns;

//   // Hàm lấy danh sách danh mục từ API
//   const fetchCategories = async () => {
//     setLoadingPage(true);
//     try {
//       const data = await CategoryService.getCategories();
//       setCategoryData(Array.isArray(data) ? data : []); // Đảm bảo data là mảng
//     } catch (error) {
//       toast.error("Lỗi khi tải danh mục!");
//       setCategoryData([]);
//     } finally {
//       setLoadingPage(false);
//     }
//   };

//   // Gọi API khi component được mount
//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   // Hàm xử lý thay đổi input form
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   // Hàm mở modal cho thêm mới hoặc chỉnh sửa
//   const handleShowModal = (mode = "add", category = {}) => {
//     if (mode === "add") {
//       setFormData({ categoryId: null, categoryName: "" });
//       setStatusFunction({ isAdd: true, isEditing: false, isViewDetail: false });
//     } else if (mode === "edit") {
//       setFormData({
//         categoryId: category.categoryId,
//         categoryName: category.categoryName,
//       });
//       setStatusFunction({ isAdd: false, isEditing: true, isViewDetail: false });
//     } else if (mode === "view") {
//       setFormData({
//         categoryId: category.categoryId,
//         categoryName: category.categoryName,
//       });
//       setStatusFunction({ isAdd: false, isEditing: false, isViewDetail: true });
//     }
//     setShowModal(true);
//   };

//   // Hàm đóng modal
//   const handleCloseModal = () => {
//     setShowModal(false);
//     setFormData({ categoryId: null, categoryName: "" });
//     setStatusFunction({ isAdd: false, isEditing: false, isViewDetail: false });
//   };

//   // Hàm xử lý submit form tạo/sửa danh mục
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     try {
//       if (statusFunction.isAdd) {
//         const newCategory = await CategoryService.createCategory({
//           categoryName: formData.categoryName,
//         });
//         setCategoryData((prevData) => [...prevData, newCategory]);
//         toast.success("Thêm mới danh mục thành công!");
//       } else if (statusFunction.isEditing) {
//         const updatedCategory = await CategoryService.updateCategory(
//           formData.categoryId,
//           { categoryName: formData.categoryName }
//         );
//         setCategoryData((prevData) =>
//           prevData.map((category) =>
//             category.categoryId === updatedCategory.categoryId
//               ? updatedCategory
//               : category
//           )
//         );
//         toast.success("Cập nhật danh mục thành công!");
//       }
//       handleCloseModal();
//     } catch (error) {
//       toast.error("Đã có lỗi xảy ra, vui lòng thử lại!");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Hàm xử lý xóa danh mục
//   const handleDelete = async (categoryId) => {
//     if (!window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) return;

//     setIsLoading(true);
//     try {
//       await CategoryService.deleteCategory(categoryId);
//       setCategoryData((prevData) =>
//         prevData.filter((category) => category.categoryId !== categoryId)
//       );
//       toast.success("Xóa danh mục thành công!");
//     } catch (error) {
//       toast.error("Đã có lỗi khi xóa danh mục!");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Hàm xử lý khi nhấn sửa một hàng
//   const onEdit = (category) => {
//     handleShowModal("edit", category);
//   };

//   // Hàm xử lý khi nhấn xem chi tiết một hàng
//   const onViewDetail = (category) => {
//     handleShowModal("view", category);
//   };

//   // Hàm xử lý khi nhấn cài đặt (nếu cần)
//   const onSetting = () => {
//     toast.info("Chức năng cài đặt đang được phát triển!");
//   };

//   // Hàm reset trạng thái
//   const handleReset = () => {
//     setFormData({ categoryId: null, categoryName: "" });
//     setStatusFunction({ isAdd: false, isEditing: false, isViewDetail: false });
//   };

//   // Hàm xử lý lưu item
//   const handleSaveItem = async () => {
//     // Hàm này sẽ được gọi khi TableManagement gọi handleSaveItem
//     // Do trong CategoryManagement đã xử lý việc thêm/sửa trong handleSubmit,
//     // có thể trả về một giá trị để xác nhận việc lưu thành công
//     // Ví dụ:
//     return await handleSubmit();
//   };

//   // Giải thích:
//   // handleSaveItem có thể được điều chỉnh theo cách TableManagement gọi nó.
//   // Trong ví dụ này, anh gọi handleSubmit khi lưu item và trả về kết quả.

//   // Nội dung modal (form thêm/sửa)
//   const modalContent = (
//     <Form onSubmit={handleSubmit}>
//       <Form.Group controlId="categoryName">
//         <Form.Label>Tên danh mục</Form.Label>
//         <Form.Control
//           type="text"
//           placeholder="Nhập tên danh mục"
//           name="categoryName"
//           value={formData.categoryName || ""}
//           onChange={handleInputChange}
//           required
//           disabled={statusFunction.isViewDetail} // Không cho chỉnh sửa khi xem chi tiết
//         />
//       </Form.Group>
//       {!statusFunction.isViewDetail && (
//         <Button variant="primary" type="submit" disabled={isLoading} className="mt-3">
//           {isLoading ? <Spinner animation="border" size="sm" /> : statusFunction.isAdd ? "Thêm mới" : "Cập nhật"}
//         </Button>
//       )}
//     </Form>
//   );

//   return (
//     <div className="container mt-4">
//       <Helmet>
//         <title>Quản lý danh mục</title>
//       </Helmet>

//       <h2 className="mb-4">Quản lý danh mục</h2>

//       {/* Bảng danh mục */}
//       <TableManagement
//         data={Array.isArray(categoryData) ? categoryData : []} // Đảm bảo data là mảng
//         columns={categoryColumns}
//         title="Quản lý danh mục"
//         defaultColumns={defaultColumns}
//         modalContent={modalContent}
//         statusFunction={statusFunction}
//         handleReset={handleReset}
//         onEdit={onEdit}
//         onViewDetail={onViewDetail}
//         handleSaveItem={handleSaveItem}
//         onDelete={handleDelete}
//         onSetting={onSetting}
//         isLoading={isLoading}
//         // buttonCustom={...} // Nếu có cấu hình button tùy chỉnh
//         onResetStatus={() => setStatusFunction({ isAdd: false, isEditing: false, isViewDetail: false })}
//       />
//     </div>
//   );
// };

// export default CategoryManagement;


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
          />
        </section>
      )}
    </>
  );

}

export default CategoryManagement;






// import { useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import TableManagement from "../../components/common/TableManagement";
// import CategoryService from "../../services/CategoryService";
// import Page500 from "../../../common/pages/Page500";
// import { Helmet } from "react-helmet-async";
// import { Modal, Button, Spinner, Form } from "react-bootstrap";


// const CategoryManagement = () => {
//   // State để lưu trữ dữ liệu danh mục từ API
//   const [categoryData, setCategoryData] = useState([]);
//   const [formData, setFormData] = useState({}); // State quản lý dữ liệu hiện tại
//   const [errorFields, setErrorFields] = useState({}); // State quản lý lỗi
//   const [statusFunction, setStatusFunction] = useState({
//     isAdd: false,
//     isEditing: false,
//     isViewDetail: false,
//   }); // Trạng thái để biết đang thêm mới hay chỉnh sửa hay xem chi tiết

//   // State để xử lý trạng thái tải dữ liệu và lỗi
//   const [isLoading, setIsLoading] = useState(false);
//   const [loadingPage, setLoadingPage] = useState(false); // này để load cho toàn bộ trang dữ liệu
//   const [errorServer, setErrorServer] = useState(null);

//   // Mảng cột của bảng
//   const categoryColumns = [
//     { key: "id", label: "ID" },
//     { key: "categoryName", label: "Tên danh mục" },
//   ];

//   // Lấy danh sách danh mục từ API
//   const fetchCategories = async () => {
//     try {
//       setLoadingPage(true);
//       const data = await CategoryService.getCategories();
//       setCategoryData(data);
//     } catch (error) {
//       toast.error("Lỗi khi tải danh mục!");
//       setErrorServer(error);
//     } finally {
//       setLoadingPage(false);
//     }
//   };

//   // Gọi API lấy danh sách khi component load
//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   // Hàm xử lý thêm mới danh mục
//   const handleAddCategory = async () => {
//     try {
//       setIsLoading(true);
//       await CategoryService.createCategory(formData);
//       toast.success("Thêm mới danh mục thành công!");
//       setFormData({});
//       setStatusFunction({ ...statusFunction, isAdd: false });
//       fetchCategories(); // Cập nhật lại danh sách sau khi thêm mới
//     } catch (error) {
//       toast.error("Lỗi khi thêm danh mục!");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Hàm xử lý cập nhật danh mục
//   const handleUpdateCategory = async () => {
//     try {
//       setIsLoading(true);
//       await CategoryService.updateCategory(formData.id, formData);
//       toast.success("Cập nhật danh mục thành công!");
//       setFormData({});
//       setStatusFunction({ ...statusFunction, isEditing: false });
//       fetchCategories(); // Cập nhật lại danh sách sau khi cập nhật
//     } catch (error) {
//       toast.error("Lỗi khi cập nhật danh mục!");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Hàm xử lý xóa danh mục
//   const handleDeleteCategory = async (id) => {
//     try {
//       setIsLoading(true);
//       await CategoryService.deleteCategory(id);
//       toast.success("Xóa danh mục thành công!");
//       fetchCategories(); // Cập nhật lại danh sách sau khi xóa
//     } catch (error) {
//       toast.error("Lỗi khi xóa danh mục!");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Xử lý mở form thêm mới
//   const handleShowAddModal = () => {
//     setStatusFunction({ ...statusFunction, isAdd: true });
//   };

//   // Xử lý mở form chỉnh sửa
//   const handleShowEditModal = (category) => {
//     setFormData(category);
//     setStatusFunction({ ...statusFunction, isEditing: true });
//   };

//   // Xử lý khi đóng form modal
//   const handleCloseModal = () => {
//     setStatusFunction({ isAdd: false, isEditing: false, isViewDetail: false });
//     setFormData({});
//   };

//   if (errorServer) {
//     return <Page500 />;
//   }

//   return (
//     <div>
//       <Helmet>
//         <title>Quản lý danh mục</title>
//       </Helmet>
//       <div className="category-management">
//         <h2 className="text-center">Quản lý danh mục</h2>
        
//         {/* Hiển thị bảng danh mục */}
//         <TableManagement
//           data={categoryData}
//           columns={categoryColumns}
//           title="Danh sách danh mục"
//           isLoading={loadingPage}
//           onEdit={handleShowEditModal}
//           onDelete={handleDeleteCategory}
//           onSetting={handleShowAddModal}
//         />

//         {/* Modal thêm mới / chỉnh sửa */}
//         <Modal
//           show={statusFunction.isAdd || statusFunction.isEditing}
//           onHide={handleCloseModal}
//         >
//           <Modal.Header closeButton>
//             <Modal.Title>
//               {statusFunction.isAdd ? "Thêm mới danh mục" : "Chỉnh sửa danh mục"}
//             </Modal.Title>
//           </Modal.Header>
//           <Modal.Body>
//             <Form>
//               <Form.Group controlId="categoryName">
//                 <Form.Label>Tên danh mục</Form.Label>
//                 <Form.Control
//                   type="text"
//                   value={formData.categoryName || ""}
//                   onChange={(e) =>
//                     setFormData({ ...formData, categoryName: e.target.value })
//                   }
//                 />
//               </Form.Group>
//             </Form>
//           </Modal.Body>
//           <Modal.Footer>
//             <Button variant="secondary" onClick={handleCloseModal}>
//               Đóng
//             </Button>
//             <Button
//               variant="primary"
//               onClick={statusFunction.isAdd ? handleAddCategory : handleUpdateCategory}
//               disabled={isLoading}
//             >
//               {isLoading ? <Spinner animation="border" size="sm" /> : "Lưu"}
//             </Button>
//           </Modal.Footer>
//         </Modal>
//       </div>
//     </div>
//   );
// };

// export default CategoryManagement;
