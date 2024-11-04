import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import TableManagement from "../../components/common/TableManagement";
import CourseService from "../../services/CourseService";
import Page500 from "../pages/Page500";
import { Spinner, Form } from "react-bootstrap";

const CourseManagement =() => {

  
    // State lưu data từ api
  const [courseData, setCourseData] = useState([]);
  const [formData, setFormData] = useState({}); // State quản lý dữ liệu hiện tại
  const [errorFields, setErrorFields] = useState({}); // State quản lý lỗi
  const [isEditing, setIsEditing] = useState(false); // Trạng thái để biết đang thêm mới hay chỉnh sửa
  const [isLoading, setIsLoading] = useState(false); // State để xử lý trạng thái tải dữ liệu
  const [loadingPage, setLoadingPage] = useState(false); // này để load cho toàn bộ trang dữ liệu
  const [errorServer, setErrorServer] = useState(null);

  // Mảng cột của bảng
  const courseColumns = [
    { key: "id", label: "Mã khóa học" },
    { key: "courseName", label: "Tên khóa học" },
    { key: "image", label: "Hình ảnh" },
    { key: "maxStudents", label: "Số lượng học viên tối đa" },
    { key: "numberOfSessions", label: "Số lượng buổi học" }, 
    { key: "price", label: "Giá khóa học" },
    { key: "description", label: "Mô tả" },
  ];

  // Loại bỏ cột 'description' khỏi courseColumns
  const defaultColumns = courseColumns.filter(
    (column) => column.key !== "description"
  );

  // Gọi API để lấy dữ liệu từ server
  const fetchCourseData = async () => {
    setLoadingPage(true);
    try {
      const data = await CourseService.getCourses(); // Sửa từ discountService thành CourseService
      setCourseData(data); // Lưu dữ liệu vào state
    } catch (err) {
      setErrorServer(err.message); // Lưu lỗi vào state nếu có
    } finally {
      setLoadingPage(false);
    }
  };

  // useEffect để gọi fetchCourseData khi component được mount
  useEffect(() => {
    fetchCourseData();
  }, []);
    
      // Hàm validate cho từng trường input
      const validateField = (key, value) => {
        let error = "";
    
        switch (key) {
          case "courseName":
            if (!value || value.trim() === "") {
              error = "Tên không được để trống.";
            }
            break;
            case "image":
            if (!value || value.trim() === "") {
              error = "Hình ảnh không được để trống.";
            }
            break;

         case "maxStudents":
            if (value === "" || value === null) {
             error = "Số lượng học viên tối đa không được để trống.";
            } else if (isNaN(value) || value <= 0) {
             error = "Số lượng học viên tối đa phải là một số dương.";
            }
            break;

            case "numberOfSessions":
            if (value === "" || value === null) {
             error = "Số lượng buổi học không được để trống.";
            } else if (isNaN(value) || value <= 0) {
             error = "Số lượng buổi học phải là một số dương.";
            }
            break;

         case "price":
            if (value === "" || value === null) {
             error = "Giá khóa học không được để trống.";
            } else if (isNaN(value) || value < 0) {
             error = "Giá khóa học phải là một số không âm.";
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
    // Kiểm tra tên khóa học
    if (!formData.courseName || formData.courseName.trim() === "") {
      newErrors.courseName = "Tên khóa học không được để trống.";
    }
  
    // Kiểm tra hình ảnh khóa học
    if (!formData.image || formData.image.trim() === "") {
      newErrors.image = "Hình ảnh không được để trống.";
    }
  
    // Kiểm tra số lượng học viên tối đa
    if (formData.maxStudents === "" || formData.maxStudents === null) {
      newErrors.maxStudents = "Số lượng học viên tối đa không được để trống.";
    } else if (isNaN(formData.maxStudents) || formData.maxStudents <= 0) {
      newErrors.maxStudents = "Số lượng học viên tối đa phải là một số dương.";
    }
    // Kiểm tra số lượng buổi học
    if (formData.numberOfSessions === "" || formData.numberOfSessions === null) {
      newErrors.numberOfSessions = "Số lượng buổi học không được để trống.";
    } else if (isNaN(formData.numberOfSessions) || formData.numberOfSessions <= 0) {
      newErrors.numberOfSessions = "Số lượng buổi học phải là một số dương.";
    }
  
    // Kiểm tra giá khóa học
    if (formData.price === "" || formData.price === null) {
      newErrors.price = "Giá khóa học không được để trống.";
    } else if (isNaN(formData.price) || formData.price < 0) {
      newErrors.price = "Giá khóa học phải là một số không âm.";
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
        courseName: "",
        image: "",
        maxStudents: "",
        numberOfSessions: "",
        price: "",
        description: "", // Nếu vẫn cần trường mô tả
        });
        setIsEditing(false);
        setErrorFields({});
    };
  
    // Hàm gọi khi nhấn "Sửa" một hàng
    const handleEdit = (item) => {
        setFormData({
        ...item, // Sao chép tất cả thuộc tính của item
        });
        setIsEditing(true);
        setErrorFields({});
    };
  
    // Hàm lưu thông tin sau khi thêm hoặc sửa
    const handleSaveItem = () => {
    if (!validateForm()) return false;
  
    setIsLoading(true); // Bắt đầu quá trình tải
  
    if (isEditing) {
      // Gọi API cập nhật sử dụng CourseService
      CourseService
        .updateCourse(formData.id, formData) 
        .then((response) => {
          let updatedCourse = response; // Lấy phản hồi từ server
          console.log("Update: " + updatedCourse);
  
          // Cập nhật state courseData với course đã được sửa
          const updatedCourses = courseData.map((course) =>
            course.id === updatedCourse.id ? updatedCourse : course
          );
          setCourseData(updatedCourses);
          toast.success("Cập nhật thành công!");
          handleReset();
        })
        .catch((error) => {
          console.error("Lỗi khi cập nhật", error);
          toast.error("Đã xảy ra lỗi khi cập nhật. Vui lòng thử lại sau.");
        })
        .finally(() => {
          setIsLoading(false); // Kết thúc quá trình tải
        });
    } else {
      // Nếu đang ở trạng thái thêm mới
      const newCourse = {
        ...formData,
      };
  
      // Gọi API thêm mới sử dụng CourseService
      CourseService
        .createCourse(newCourse) 
        .then((response) => {
          let createdCourse = response; // Lấy phản hồi từ server (bao gồm ID)
  
          // Cập nhật mảng courseData với item vừa được thêm
          setCourseData([...courseData, createdCourse]);
  
          toast.success("Thêm mới thành công!");
          handleReset();
        })
        .catch((error) => {
          console.error("Lỗi khi thêm mới", error);
          toast.error("Đã xảy ra lỗi khi thêm mới. Vui lòng thử lại sau.");
        })
        .finally(() => {
          setIsLoading(false); // Kết thúc quá trình tải
        });
    }
    return true;
  };
  
  // Hàm xóa một khóa học
const handleDelete = (deleteId) => {
    if (deleteId) {
      setIsLoading(true);
      CourseService 
        .deleteCourse(deleteId) 
        .then(() => {
          setCourseData( 
            courseData.filter((course) => course.id !== deleteId) 
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
          <Form.Group controlId="formCourseName">
            <Form.Label>Tên khóa học</Form.Label>
            <Form.Control
              type="text"
              name="courseName"
              value={formData.courseName}
              maxLength={100}
              onChange={(e) =>
                handleInputChange("courseName", e.target.value)
              }
              isInvalid={!!errorFields.courseName}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errorFields.courseName}
            </Form.Control.Feedback>
          </Form.Group>
        </div>

        <div className="col-md-6 mb-3">
          <Form.Group controlId="formImage">
            <Form.Label>Hình ảnh khóa học</Form.Label>
            <Form.Control
              type="file"
              name="image"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const fileUrl = URL.createObjectURL(file);
                  handleInputChange("image", fileUrl);
                }
              }}
              isInvalid={!!errorFields.image}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errorFields.image}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Phần để hiển thị hình ảnh */}
          <div
            style={{
              width: '100%', // Chiếm hết chiều rộng của form
              height: '150px', // Chiều cao cố định cho không gian hiển thị hình ảnh
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              border: '1px dashed #ccc', // Viền gạch để phân biệt không gian
              borderRadius: '4px', // Bo góc nhẹ
              overflow: 'hidden', // Ẩn phần vượt ra ngoài
              marginTop: '10px', // Khoảng cách giữa input và không gian hình ảnh
            }}
          >
            {formData.image ? (
              <img
                src={formData.image}
                alt="Hình ảnh khóa học"
                style={{
                  width: '100%', // Chiếm toàn bộ chiều rộng
                  height: '100%', // Chiếm toàn bộ chiều cao
                  objectFit: 'cover', // Giữ tỷ lệ hình ảnh mà không bị bóp méo
                }}
              />
            ) : (
              <span>Chưa có hình ảnh nào</span> // Hiển thị thông điệp nếu chưa có hình ảnh
            )}
          </div>


        </div>
  
        
      </div>
  
      <div className="row">
        <div className="col-md-6 mb-3">
        <Form.Group controlId="formMaxStudents">
          <Form.Label>Số lượng học viên tối đa</Form.Label>
          <Form.Select
            name="maxStudents"
            value={formData.maxStudents}
            onChange={(e) => handleInputChange("maxStudents", e.target.value)}
            isInvalid={!!errorFields.maxStudents}
            required
          >
            <option value="">Chọn số lượng</option>
            {[1, 2, 3, 4].map((num) => (
              <option key={num} value={num}>
                1 kèm {num}
              </option>
            ))}
          </Form.Select>
          <Form.Control.Feedback type="invalid">
            {errorFields.maxStudents}
          </Form.Control.Feedback>
        </Form.Group>

        </div>

        <div className="col-md-6 mb-3">
          <Form.Group controlId="formPrice">
            <Form.Label>Giá khóa học</Form.Label>
            <Form.Control
              type="number"
              name="price"
              min={0}
              value={formData.price}
              onChange={(e) => handleInputChange("price", e.target.value)}
              isInvalid={!!errorFields.price}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errorFields.price}
            </Form.Control.Feedback>
          </Form.Group>
        </div>
      </div>
  
      <div className="row">
       <div className="col-md-6 mb-3">
          <Form.Group controlId="formNumberOfSessions">
            <Form.Label>Số buổi học</Form.Label>
            <Form.Control
              type="number"
              name="numberOfSessions"
              value={formData.numberOfSessions}
              onChange={(e) => handleInputChange("numberOfSessions", e.target.value)}
              isInvalid={!!errorFields.numberOfSessions}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errorFields.numberOfSessions}
            </Form.Control.Feedback>
          </Form.Group>
        </div>
  
        <div className="col-md-6 mb-3">
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
      </div>
    </>
  );


  return (
    <>
      {/* Hiển thị loader khi đang tải trang */}
      {loadingPage ? (
        <div className="w-100 h-100 d-flex justify-content-center align-items-center">
          <Spinner animation="border" variant="primary" className=""></Spinner>
        </div>
      ) : errorServer ? (
        <Page500 message={errorServer} />
      ) : (
        <section className="row m-0 p-0 ">
          <TableManagement
            data={courseData} // Đổi thành courseData
            columns={courseColumns} // Đổi thành courseColumns
            title={"Quản lý khóa học"} // Đổi tiêu đề thành "Quản lý khóa học"
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
  



}



export default CourseManagement;
























// import React, { useState } from 'react';
// import { Pagination, Modal, Button, Form } from 'react-bootstrap';
// //QLy khóa học nha

// function CourseManagement() {

//     //định nghĩa cho pagination
//     const [current2Page, setCurrentPage] = useState(1);
//     const totalPages = 5; // Số trang thực tế của bạn
//     const handlePrevPage = () => {
//         if (currentPage > 1) {
//             setCurrentPage(currentPage - 1);
//         }
//     };
//     const handleNextPage = () => {
//         if (currentPage < totalPages) {
//             setCurrentPage(currentPage + 1);
//         }
//     };

//     // Modal state để mở/đóng modal
//     const [showModal, setShowModal] = useState(false);

//     const handleShowModal = () => setShowModal(true);
//     const handleCloseModal = () => setShowModal(false);

//     // Hàm xử lý form submit
//     const handleFormSubmit = (e) => {
//         e.preventDefault();
//         // Xử lý logic thêm khóa học tại đây
//         handleCloseModal(); // Đóng modal sau khi submit
//     };

//     return (
//         <div className="container-fluid">
//             <h4>Danh sách khóa học</h4>

            
//             <div className="row">
//                 <div className="col-md-6 mb-2">
                    
//                     <form className="d-flex w-100" role="search">
//                         <div className="input-group">
//                             <input className="form-control" type="search" placeholder="Tìm kiếm khóa học" aria-label="Search" />
//                             <button className="btn btn-outline-success" type="submit">
//                                 <i className="fa-solid fa-magnifying-glass"></i>
//                             </button>
//                         </div>
//                     </form>
//                 </div>
//                 <div className="col-md-6 d-flex justify-content-end">
//                     <button className="btn btn-outline-success me-2 " type="submit">
//                         <i className="fa-solid fa-filter"></i> Filter
//                     </button>
//                     <button className="btn btn-outline-success me-2" type="submit" onClick={handleShowModal}>
//                         <i className="fa-solid fa-plus"></i> Thêm
//                     </button>
//                 </div>
//             </div>
//             <table class="table table-responsive table-bordered mt-3">
//                 <thead>
//                     <tr>
//                         <th scope="col">Mã KH</th>
//                         <th scope="col">Tên Khóa học</th>
//                         <th scope="col">Hình ảnh</th>
//                         <th scope="col">Học sinh tối đa</th>
//                         <th scope="col">Mô tả</th>
//                         <th scope="col">Giá tiền</th>
//                         <th scope="col">Số buổi học</th>
//                         <th scope="col">Hành động</th>

//                     </tr>
//                 </thead>
//                 <tbody>
//                     <tr>
//                         <td></td>
//                         <td></td>
//                         <td></td>
//                         <td></td>
//                         <td></td>
//                         <td></td>
//                         <td></td>
                     
//                         <td className="ps-3">
//                             <i className="fa-solid fa-pen m-2"></i>
//                             <i className="fa-solid fa-trash-can "></i>
//                         </td>


//                     </tr>
//                     <tr>
//                         <td></td>
//                         <td></td>
//                         <td></td>
//                         <td></td>
//                         <td></td>
//                         <td></td>
//                         <td></td>
                       
//                         <td className="ps-3">
//                             <i className="fa-solid fa-pen m-2"></i>
//                             <i className="fa-solid fa-trash-can "></i>
//                         </td>
//                     </tr>
//                     <tr>

//                         <td></td>
//                         <td></td>
//                         <td></td>
//                         <td></td>
//                         <td></td>
//                         <td></td>
//                         <td></td>
//                         <td className="ps-3">
//                             <i className="fa-solid fa-pen m-2"></i>
//                             <i className="fa-solid fa-trash-can "></i>
//                         </td>
//                     </tr>

//                 </tbody>
//             </table>

//             <Pagination className="justify-content-center">
//                 <Pagination.Prev onClick={handlePrevPage} disabled={currentPage === 1} />
//                 {Array.from({ length: totalPages }, (_, index) => (
//                     <Pagination.Item
//                         key={index}
//                         active={currentPage === index + 1}
//                         onClick={() => setCurrentPage(index + 1)}
//                     >
//                         {index + 1}
//                     </Pagination.Item>
//                 ))}
//                 <Pagination.Next onClick={handleNextPage} disabled={currentPage === totalPages} />
//             </Pagination>


//             {/* Modal thêm khóa học */}
//             <Modal show={showModal} onHide={handleCloseModal}>
//                 <Modal.Header closeButton>
//                     <Modal.Title>Thêm Khóa Học</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                     <Form onSubmit={handleFormSubmit}>
//                         <Form.Group controlId="formCourseCode">
//                             <Form.Label>Mã khóa học</Form.Label>
//                             <Form.Control type="text" placeholder="Nhập mã khóa học" required />
//                         </Form.Group>



//                         <Form.Group controlId="formName" className="mt-3">
//                             <Form.Label>Tên Khóa Học</Form.Label>
//                             <Form.Control type="text" placeholder="Nhập tên khóa học" required />
//                         </Form.Group>
//                         <Form.Group controlId="formImage" className="mt-3">
//                             <Form.Label>Hình ảnh</Form.Label>
//                             <Form.Control type="text" placeholder="Nhập link hình ảnh" required />
//                         </Form.Group>

//                         <Form.Group controlId="formMaxStudent" className="mt-3">
//                             <Form.Label>Số học viên tham gia tối đa</Form.Label>
//                             <Form.Control type="number" required />
//                         </Form.Group>

//                         <Form.Group controlId="formDescription" className="mt-3">
//                             <Form.Label>Mô tả khóa học</Form.Label>
//                             <Form.Control type="text-area" required />
//                         </Form.Group>

//                         <Form.Group controlId="formPrice" className="mt-3">
//                             <Form.Label>Học phí</Form.Label>
//                             <Form.Control type="number" placeholder="Nhập học phí (đơn vị: VNĐ)" required />
//                         </Form.Group>

//                         <Form.Group controlId="formSessions" className="mt-3">
//                             <Form.Label>Số buổi học</Form.Label>
//                             <Form.Control type="number" placeholder="Nhập số lượng buổi học" required />
//                         </Form.Group>
//                         <Button variant="primary" type="submit" className="mt-3">
//                             Thêm Khóa Học
//                         </Button>
//                     </Form>
//                 </Modal.Body>
//             </Modal>



//         </div>
//     )
// }








