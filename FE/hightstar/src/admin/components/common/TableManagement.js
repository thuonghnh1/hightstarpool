import { Fragment, useState } from "react";
import { Form, Pagination, Dropdown, DropdownButton } from "react-bootstrap";
import CustomModal from "./CustomModal";
import ImageModal from "./ImageModal";
import DeleteModal from "./DeleteModal";
import "../../css/table-management.css";
import iconTrainer from "../../../assets/images/icons/trainer.png";
import iconAll from "../../../assets/images/icons/all.png";
import iconIndividual from "../../../assets/images/icons/personalization.png";
import defaultImage from "../../../assets/images/defaultImage.png";
import { formatDateTimeToDMY } from "../../utils/FormatDate";

const TableManagement = ({
  data,
  columns,
  title,
  defaultColumns,
  modalContent,
  statusFunction,
  handleReset,
  onEdit,
  onViewDetail,
  handleSaveItem,
  onDelete,
  onSetting,
  isLoading,
  buttonCustom,
  onResetStatus,
}) => {
  // State management
  const [visibleColumns, setVisibleColumns] = useState(
    defaultColumns.map((col) => col.key)
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });
  const [showModal, setShowModal] = useState(false); // Hiển thị modal thêm/sửa
  const [deleteId, setDeleteId] = useState(null); // ID của item cần xóa
  const [showConfirmModal, setShowConfirmModal] = useState(false); // Hiển thị modal xác nhận xóa
  const [expandedRows, setExpandedRows] = useState([]); // Theo dõi các hàng đang được mở
  const [showModalImage, setShowModalImage] = useState(false); // Hiển thị modal hình ảnh lớn
  const [selectedImage, setSelectedImage] = useState(null);

  const handleRenderBtn = () => {
    // Danh sách button mặc định nếu button không được định nghĩa
    const defaultButtonConfig = {
      btnAdd: true,
      btnEdit: true,
      btnDelete: true,
      btnDetail: false,
      btnSetting: true,
    };

    // Sử dụng buttonCustom nếu có, nếu không thì lấy defaultButtonConfig
    const buttonConfig = buttonCustom ?? defaultButtonConfig;
    return buttonConfig;
  };

  // Hàm render custom cell dựa trên loại cột
  const renderCustomCell = (column, item) => {
    switch (column.key) {
      case "status":
        let statusClass = "";
        let statusText = "";

        switch (item.status) {
          case "ACTIVE":
            statusClass = "text-bg-success";
            statusText = "Hoạt động";
            break;
          case "DISABLED":
            statusClass = "text-bg-secondary";
            statusText = "Vô hiệu hóa";
            break;
          case "PENDING":
            statusClass = "text-bg-warning";
            statusText = "Đang chờ xử lý";
            break;
          case "ON_DELIVERY":
            statusClass = "text-bg-info";
            statusText = "Đang giao hàng";
            break;
          case "COMPLETED":
            statusClass = "text-bg-primary";
            statusText = "Hoàn thành";
            break;
          case "CANCELED":
            statusClass = "text-bg-danger";
            statusText = "Đã hủy";
            break;
          case "EXPIRED":
            statusClass = "text-bg-secondary";
            statusText = "Đã hết hạn";
            break;
          case "USED":
            statusClass = "text-bg-info";
            statusText = "Đã sử dụng";
            break;
          case true:
            statusClass = "text-bg-info";
            statusText = "Chưa xem";
            break;
          case false:
            statusClass = "text-bg-muted";
            statusText = "Đã xem";
            break;
          default:
            statusClass = "text-bg-muted"; // Trường hợp mặc định
            statusText = "Không xác định";
        }

        return (
          <span
            className={`rounded-3 fw-bold px-2 py-1 ${statusClass}`}
            style={{ fontSize: "13px" }}
          >
            {statusText}
          </span>
        );
      case "image":
      case "avatar":
        return (
          <img
            src={item[column.key] || defaultImage} // Nếu item[column.key] không có, hiển thị ảnh mặc định
            alt={item.name || "Ảnh mặc định"} // Đổi alt thành "Default Image" nếu item.name không tồn tại
            className="object-fit-cover rounded-circle"
            style={{ width: "45px", height: "45px", cursor: "pointer" }}
            onClick={(e) => {
              e.stopPropagation(); // ngăn chặn sự kiện lan truyền sang cha.
              handleImageClick(item[column.key] || defaultImage);
            }}
          />
        );
      case "images":
        return item[column.key] ? (
          <div
            className="py-3"
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              gap: "0",
            }}
          >
            {item[column.key]
              .split(",") // Tách chuỗi thành mảng các URL
              .map((image, index) => (
                <img
                  key={index}
                  src={image.trim() || defaultImage} // Xóa khoảng trắng dư thừa
                  alt={`Ảnh ${index + 1}`}
                  className="rounded-circle"
                  style={{
                    width: "40px",
                    height: "40px",
                    position: "absolute",
                    left: `${index * 10}px`, // Dịch chuyển một chút sang phải
                    zIndex: index, // Mỗi ảnh có z-index tương ứng
                    cursor: "pointer",
                    transition: "transform 0.2s, z-index 0.2s",
                    border: "2px solid white", // Tạo đường viền giữa các ảnh
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.zIndex = 100; // Đưa ảnh lên trên cùng khi hover
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.zIndex = index; // Trả lại z-index ban đầu khi không hover
                  }}
                  onClick={(e) => {
                    e.stopPropagation(); // Ngăn chặn sự kiện lan truyền
                    handleImageClick(image.trim());
                  }}
                />
              ))}
          </div>
        ) : (
          "Không có"
        );
      case "rating":
        const stars = [];

        for (let i = 1; i <= 5; i++) {
          if (i <= Math.floor(item.rating)) {
            stars.push(
              <i
                key={i}
                className="bi bi-star-fill text-warning me-1"
                style={{ fontSize: "15px" }}
              />
            );
          } else if (i === Math.ceil(item.rating) && item.rating % 1 !== 0) {
            stars.push(
              <i
                key={i}
                className="bi bi-star-half text-warning me-1"
                style={{ fontSize: "15px" }}
              />
            );
          } else {
            stars.push(
              <i
                key={i}
                className="bi bi-star text-warning me-1"
                style={{ fontSize: "15px" }}
              />
            );
          }
        }
        return <div>{stars}</div>;
      case "gender":
        return (
          <span className={`rounded-3 px-1 py-1 `}>
            {item.gender === true ? (
              <>
                <i className="bi bi-gender-male"></i> Nam
              </>
            ) : (
              <>
                <i className="bi bi-gender-female"></i> Nữ
              </>
            )}
          </span>
        );

      case "dayOfWeek":
        const dayLabels = {
          MONDAY: "Thứ Hai",
          TUESDAY: "Thứ Ba",
          WEDNESDAY: "Thứ Tư",
          THURSDAY: "Thứ Năm",
          FRIDAY: "Thứ Sáu",
          SATURDAY: "Thứ Bảy",
          SUNDAY: "Chủ Nhật",
        };
        return (
          <span className={`rounded-3 px-2 py-1`}>
            {dayLabels[item.dayOfWeek]}
          </span>
        );

      case "ticketType":
        const ticketTypeLabels = {
          ONETIME_TICKET: "Vé một lần",
          WEEKLY_TICKET: "Vé tuần",
          MONTHLY_TICKET: "Vé tháng",
          STUDENT_TICKET: "Vé học viên",
        };
        return (
          <span className={`rounded-3 px-2 py-1`}>
            {ticketTypeLabels[item.ticketType]}
          </span>
        );

      case "role":
        return (
          <span className="d-flex align-items-center">
            {item.role === "ADMIN" && (
              <>
                <i className="bi bi-shield-fill text-danger fs-5 mx-1 me-1"></i>
                Quản Lý
              </>
            )}
            {item.role === "EMPLOYEE" && (
              <>
                <i className="fa-solid fa-user-tie fs-5 text-primary me-2 mx-1"></i>
                Nhân Viên
              </>
            )}
            {item.role === "USER" && (
              <>
                <i className="bi bi-person-fill fs-4 text-info me-1"></i>Khách
                Hàng
              </>
            )}
            {item.role === "TRAINER" && (
              <>
                <img
                  src={iconTrainer}
                  alt="Role hlv"
                  className="img-fluid rounded-circle mx-1 me-1"
                  style={{ width: "20px", height: "20px" }}
                />
                Huấn Luyện Viên
              </>
            )}
          </span>
        );

      case "total":
      case "penaltyAmount":
      case "price":
        const formattedPrice = new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
          minimumFractionDigits: 0,
        }).format(item[column.key]);
        return <span>{formattedPrice}</span>;

      case "percentage":
        return <span>{item.percentage} %</span>;
      case "orderDate":
        return <span>{formatDateTimeToDMY(item.orderDate)}</span>;
      case "recipientType":
        return (
          <span className="d-flex align-items-center">
            {item.recipientType === "ALL" && (
              <>
                <img
                  src={iconAll}
                  alt="Icon hlv"
                  className="img-fluid rounded-circle mx-1 me-1"
                  style={{ width: "20px", height: "20px" }}
                />
                Tất Cả
              </>
            )}
            {item.recipientType === "INDIVIDUAL" && (
              <>
                <img
                  src={iconIndividual}
                  alt="Icon hlv"
                  className="img-fluid rounded-circle mx-1 me-1"
                  style={{ width: "20px", height: "20px" }}
                />
                Cá Nhân
              </>
            )}
            {item.recipientType === "ADMIN" && (
              <>
                <i className="bi bi-shield-fill text-danger fs-5 mx-1 me-1"></i>
                Quản Lý
              </>
            )}
            {item.recipientType === "EMPLOYEE" && (
              <>
                <i className="fa-solid fa-user-tie fs-5 text-primary me-2 mx-1"></i>
                Nhân Viên
              </>
            )}
            {item.recipientType === "USER" && (
              <>
                <i className="bi bi-person-fill fs-4 text-info me-1"></i>Khách
                Hàng
              </>
            )}
            {item.recipientType === "TRAINER" && (
              <>
                <img
                  src={iconTrainer}
                  alt="Icon hlv"
                  className="img-fluid rounded-circle mx-1 me-1"
                  style={{ width: "20px", height: "20px" }}
                />
                Huấn Luyện Viên
              </>
            )}
          </span>
        );
      case "checkInTime":
        return item[column.key] || "Chưa vào";
      case "checkOutTime":
        return item[column.key] || "Chưa ra";
      case "qrCodeBase64":
        return (
          <img
            src={`data:image/png;base64,${item.qrCodeBase64}`}
            alt="QR Code"
            width={45}
            height={45}
            style={{ objectFit: "cover", cursor: "pointer" }}
            onClick={(e) => {
              e.stopPropagation(); // ngăn chặn sự kiện lan truyền sang cha.
              handleImageClick(
                `data:image/png;base64,${item.qrCodeBase64}` || defaultImage
              );
            }}
          />
        );
      default:
        return item[column.key] || "Không có"; // Trả về giá trị mặc định nếu không cần custom
    }
  };

  // Xử lý toggle mở rộng hàng
  const handleRowToggle = (id) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  // Tính toán tổng số trang
  const totalPages = Math.ceil(data.length / itemsPerPage);

  // Sắp xếp dữ liệu theo cấu hình hiện tại
  const sortedData = [...data].sort((a, b) => {
    if (sortConfig.key) {
      let compareA = a[sortConfig.key];
      let compareB = b[sortConfig.key];

      // Chuẩn hóa dữ liệu dạng chuỗi để so sánh
      if (typeof compareA === "string" && typeof compareB === "string") {
        compareA = compareA.toLowerCase();
        compareB = compareB.toLowerCase();
      }

      // So sánh theo chiều tăng hoặc giảm
      return sortConfig.direction === "asc"
        ? compareA > compareB
          ? 1
          : compareA < compareB
          ? -1
          : 0
        : compareA < compareB
        ? 1
        : compareA > compareB
        ? -1
        : 0;
    }
    return 0;
  });

  // Lọc dữ liệu theo từ khóa tìm kiếm và cột hiển thị
  const filteredData = sortedData.filter((item) =>
    visibleColumns.some((key) =>
      item[key]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Phân trang dữ liệu
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Xử lý chuyển trang
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  // Xử lý thay đổi số mục hiển thị mỗi trang
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  // Xử lý sắp xếp
  const handleSort = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });
  };

  // Xử lý ẩn/hiện các cột
  const handleColumnToggle = (key) => {
    setVisibleColumns((prevColumns) =>
      prevColumns.includes(key)
        ? prevColumns.filter((colKey) => colKey !== key)
        : [...prevColumns, key]
    );
  };
  const handleImageClick = (imageSrc) => {
    // xử lý khi click vào hình ảnh trên bảng
    setSelectedImage(imageSrc);
    setShowModalImage(true);
  };

  const handleCloseModalImage = () => setShowModalImage(false);

  // Mở modal thêm/sửa
  const handleShowModal = () => setShowModal(true);

  // Đóng modal thêm/sửa
  const handleCloseModal = () => {
    onResetStatus(); // cập nhật trạng thái các công việc
    setShowModal(false); // Đóng modal
  };

  // Xử lý lưu dữ liệu
  const handleSubmit = async () => {
    if (await handleSaveItem()) {
      handleCloseModal();
    }
  };

  // Xử lý mở modal xác nhận xóa
  const handleShowConfirmModal = (id) => {
    setDeleteId(id);
    setShowConfirmModal(true);
  };

  // Đóng modal xác nhận xóa
  const handleCloseConfirmModal = () => {
    setShowConfirmModal(false);
    setDeleteId(null);
  };

  // Xác nhận xóa
  const handleConfirm = () => {
    if (deleteId) {
      onDelete(deleteId);
      handleCloseConfirmModal();
    }
  };

  return (
    <div className="table__management col-12 p-4 bg-white rounded-3">
      <h5 className="mb-4 text-uppercase fw-bold">{title}</h5>
      <div className="row mb-4">
        <div className="col-lg-8 col-12">
          {/* Input tìm kiếm */}
          <input
            type="text"
            className="form-control shadow-none"
            placeholder="Tìm kiếm"
            value={searchTerm} // Giá trị của input
            onChange={(e) => setSearchTerm(e.target.value)} // Xử lý thay đổi giá trị
          />
        </div>
        <div className="col-lg-4 col-12 d-flex justify-content-lg-end mt-3 mt-lg-0">
          {handleRenderBtn().btnSetting && (
            <button
              className="btn btn-success me-2 text-nowrap"
              onClick={onSetting}
            >
              <i className="bi bi-gear me-2"></i>Cài đặt
            </button>
          )}
          {handleRenderBtn().btnAdd && (
            <button
              className="btn btn-primary me-2 text-nowrap"
              onClick={() => {
                handleReset();
                handleShowModal();
              }}
            >
              <i className="bi bi-plus-circle"></i> Thêm
            </button>
          )}
          <div className="dropdown text-nowrap">
            <DropdownButton
              id="dropdown-basic-button"
              title={<i className="bi bi-layout-three-columns me-1"></i>}
            >
              {columns.map((column) => (
                <Dropdown.Item
                  key={column.key}
                  onClick={() => handleColumnToggle(column.key)}
                >
                  <Form.Check
                    type="checkbox"
                    label={column.label}
                    checked={visibleColumns.includes(column.key)}
                    readOnly
                  />
                </Dropdown.Item>
              ))}
            </DropdownButton>
          </div>
        </div>
      </div>

      <div className="table__wrapper row m-0">
        <div className="light__text table-responsive col-12 p-0 custom-scrollbar">
          <table className="table table-hover mb-2">
            <thead>
              <tr>
                {columns
                  .filter((col) => visibleColumns.includes(col.key))
                  .map((column) => (
                    <th
                      scope="col"
                      key={column.key}
                      onClick={() => handleSort(column.key)}
                    >
                      {column.label}
                      <span className="icon_sort ps-2 light__text">
                        <i
                          className={`bi bi-arrow-up ${
                            sortConfig.key === column.key &&
                            sortConfig.direction === "asc"
                              ? "text-black"
                              : "opacity-50"
                          }`}
                        ></i>
                        <i
                          className={`bi bi-arrow-down ${
                            sortConfig.key === column.key &&
                            sortConfig.direction === "desc"
                              ? "text-black"
                              : "opacity-50"
                          }`}
                        ></i>
                      </span>
                    </th>
                  ))}
                <th></th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((item) => (
                <Fragment key={item.id}>
                  <tr
                    style={{ cursor: "pointer" }}
                    onClick={() => handleRowToggle(item.id)}
                  >
                    {columns
                      .filter((col) => visibleColumns.includes(col.key))
                      .map((column) => (
                        <td key={column.key} className="align-middle">
                          {renderCustomCell(column, item)}
                        </td>
                      ))}
                    <td className="align-middle">
                      <button
                        className="btn btn__show p-1"
                        onClick={(e) => {
                          e.stopPropagation(); // Ngăn chặn sự kiện lan truyền lên tr
                          handleRowToggle(item.id);
                        }}
                      >
                        {expandedRows.includes(item.id) ? (
                          <i className="bi bi-dash-circle"></i>
                        ) : (
                          <i className="bi bi-plus-circle"></i>
                        )}
                      </button>
                    </td>
                  </tr>
                  {expandedRows.includes(item.id) && (
                    <tr key={item.id + "-expanded"} className="expand-row">
                      <td colSpan={columns.length + 1}>
                        <div className="collapse-content">
                          <ul className="px-2 m-0 list-unstyled">
                            {columns
                              .filter(
                                (column) => !visibleColumns.includes(column.key)
                              ) // Lọc các cột chưa được hiển thị
                              .map((column) => (
                                <li
                                  key={column.key}
                                  className="py-2 w-75 m-0 text-truncate d-flex align-items-center"
                                >
                                  <strong className="me-3 p-0">
                                    {column.label}:
                                  </strong>
                                  <span className="p-0">
                                    {renderCustomCell(column, item)}
                                  </span>
                                </li>
                              ))}
                            <li>
                              {handleRenderBtn().btnEdit && (
                                <button
                                  className="btn btn__edit me-3 my-2"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit(item);
                                    handleShowModal();
                                  }}
                                >
                                  <i className="bi bi-pencil-square"></i> Chỉnh
                                  sửa
                                </button>
                              )}
                              {handleRenderBtn().btnDelete && (
                                <button
                                  className="btn btn__delete p-1 me-4"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleShowConfirmModal(item.id);
                                  }}
                                >
                                  <i className="bi bi-trash-fill"></i> Xóa
                                </button>
                              )}
                              {handleRenderBtn().btnDetail && (
                                <button
                                  className="btn btn__detail p-1 me-3"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onViewDetail(item);
                                    handleShowModal();
                                  }}
                                >
                                  <i className="bi bi-card-list"></i> Xem chi
                                  tiết
                                </button>
                              )}
                            </li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="box__control d-flex flex-column flex-md-row justify-content-md-between justify-content-center align-items-center mt-3 light__text">
        <div className="d-flex align-items-center">
          <div className="d-flex align-items-center">
            <span className="me-1">Xem</span>
            <Form.Select
              aria-label="Số bản ghi"
              className="w-auto light__text me-1"
              onChange={handleItemsPerPageChange}
              value={itemsPerPage}
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </Form.Select>
            <span>mục</span>
          </div>
        </div>

        <Pagination className="m-0 mt-3 mt-md-0">
          <Pagination.First
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
          />
          {[...Array(totalPages).keys()].map((page) => (
            <Pagination.Item
              key={page + 1}
              active={page + 1 === currentPage}
              onClick={() => handlePageChange(page + 1)}
            >
              {page + 1}
            </Pagination.Item>
          ))}
          <Pagination.Last
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
          />
        </Pagination>
      </div>
      {/* Modal Thêm Item */}

      <CustomModal
        show={showModal}
        handleClose={handleCloseModal}
        title={
          statusFunction.isEditing ? (
            <>
              CẬP NHẬT BẢN GHI{" "}
              <i className="bi bi-arrow-repeat text-success fs-4"></i>
            </>
          ) : statusFunction.isAdd ? (
            <>
              THÊM MỚI BẢN GHI{" "}
              <i className="bi bi-plus-circle-dotted text-success ms-1 fs-4"></i>
            </>
          ) : (
            <>
              XEM CHI TIẾT{" "}
              <i className="bi bi-card-list text-succes ms-1 fs-4"></i>
            </>
          )
        }
        onSubmit={handleSubmit}
        isLoading={isLoading}
        statusFunction={statusFunction}
      >
        {/* Truyền children modal thông qua props */}
        {modalContent}
      </CustomModal>
      <DeleteModal
        show={showConfirmModal}
        onConfirm={handleConfirm}
        onClose={handleCloseConfirmModal}
        isLoading={isLoading}
      />
      {/* Sử dụng ImageModal */}
      <ImageModal
        show={showModalImage}
        imageSrc={selectedImage}
        onClose={handleCloseModalImage}
      />
    </div>
  );
};

export default TableManagement;
