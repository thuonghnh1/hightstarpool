import { Fragment, useState } from "react";
import { Form, Pagination, Dropdown, DropdownButton } from "react-bootstrap";
import CustomModal from "./CustomModal";
import ImageModal from "./ImageModal";
import DeleteModal from "./DeleteModal";
import "../../css/table-management.css";
import iconTrainer from "../../../assets/images/icons/trainer.png";

const TableManagement = ({
  data,
  columns,
  title,
  defaultColumns,
  modalContent,
  isEditing,
  handleReset,
  onEdit,
  handleSaveItem,
  onDelete,
  isLoading,
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

  const handleImageClick = (imageSrc) => {
    // xử lý khi click vào hình ảnh trên bảng
    setSelectedImage(imageSrc);
    setShowModalImage(true);
  };

  const handleCloseModalImage = () => setShowModalImage(false);

  // Hàm render custom cell dựa trên loại cột
  const renderCustomCell = (column, item) => {
    switch (column.key) {
      case "status":
        return (
          <span
            className={`rounded-3 fw-bold px-2 py-1 ${item.status === "ACTIVE" ? "text-bg-success" : "text-bg-secondary"
              }`}
            style={{ fontSize: "13px" }}
          >
            {item.status === "ACTIVE" ? "Hoạt động" : "Vô hiệu hóa"}
          </span>
        );
      case "avatar":
      case "image":
      case "avatar":
        return (
          <img
            src={item[column.key]}
            alt={item.name}
            className="object-fit-cover rounded-circle"
            style={{ width: "45px", height: "45px", cursor: "pointer" }}
            onClick={() => handleImageClick(item[column.key])}
          />
        );

      case "rating":
        const stars = [];
        for (let i = 1; i <= 5; i++) {
          stars.push(
            <i
              key={i}
              className={`bi ${i <= item.averageRating ? "bi-star-fill" : "bi-star"
                } text-warning me-1`}
            ></i>
          );
        }
        return <div>{stars}</div>;
      case "gender":
        return (
          <span
            className={`rounded-3 px-2 py-1 `}
          >
            {item.gender === true ? <><i className="bi bi-gender-male"></i> Nam</> : <><i className="bi bi-gender-female"></i> Nữ</>}
          </span>
        );
      // Thêm các case khác nếu cần cho các cột tuỳ chỉnh khác

      case "role":
        return (
          <span className="d-flex align-items-center">
            {item.role === "ADMIN" && (
              <i className="bi bi-shield-fill text-primary me-1"></i>
            )}
            {item.role === "USER" && (
              <i className="bi bi-person-fill fs-5 text-info me-1"></i>
            )}
            {item.role === "TRAINER" && (
              <img
                src={iconTrainer}
                alt="Role hlv"
                className="img-fluid rounded-circle"
                style={{ width: "17px", height: "17px" }}
              />
            )}
            {item.role}
          </span>
        );

      default:
        return item[column.key]; // Trả về giá trị mặc định nếu không cần custom
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

  // Mở modal thêm/sửa
  const handleShowModal = () => setShowModal(true);

  // Đóng modal thêm/sửa
  const handleCloseModal = () => setShowModal(false);

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
            className="form-control"
            placeholder="Tìm kiếm"
            value={searchTerm} // Giá trị của input
            onChange={(e) => setSearchTerm(e.target.value)} // Xử lý thay đổi giá trị
          />
        </div>
        <div className="col-lg-4 col-12 d-flex justify-content-lg-end mt-3 mt-lg-0">
          <button className="btn btn-success me-2 text-nowrap">
            <i className="bi bi-filter"></i> Lọc
          </button>
          <button
            className="btn btn-primary me-2 text-nowrap"
            onClick={() => {
              handleReset();
              handleShowModal();
            }}
          >
            <i className="bi bi-plus-circle"></i> Thêm
          </button>
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
                          className={`bi bi-arrow-up ${sortConfig.key === column.key &&
                            sortConfig.direction === "asc"
                            ? "text-black"
                            : "opacity-50"
                            }`}
                        ></i>
                        <i
                          className={`bi bi-arrow-down ${sortConfig.key === column.key &&
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
                  <tr>
                    {columns
                      .filter((col) => visibleColumns.includes(col.key))
                      .map((column) => (
                        <td key={column.key} className="align-middle">
                          {renderCustomCell(column, item)}
                        </td>
                      ))}
                    <td className="align-middle">
                      {visibleColumns.length === columns.length || (
                        <button
                          className="btn btn__show p-1"
                          onClick={() => handleRowToggle(item.id)}
                        >
                          {expandedRows.includes(item.id) ? (
                            <i className="bi bi-dash-circle"></i>
                          ) : (
                            <i className="bi bi-plus-circle"></i>
                          )}
                        </button>
                      )}
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
                                  className="py-2 w-75 m-0 text-truncate"
                                >
                                  <strong className="me-3 p-0">
                                    {column.label}:
                                  </strong>
                                  <span className=" p-0">
                                    {renderCustomCell(column, item)}
                                  </span>
                                </li>
                              ))}
                            <li>
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
                              <button
                                className="btn btn__delete p-1 me-3"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleShowConfirmModal(item.id);
                                }}
                              >
                                <i className="bi bi-trash-fill"></i> Xóa
                              </button>
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
          isEditing ? (
            <>
              CẬP NHẬT BẢN GHI{" "}
              <i className="bi bi-arrow-repeat text-success fs-4"></i>
            </>
          ) : (
            <>
              THÊM MỚI BẢN GHI{" "}
              <i className="bi bi-plus-circle-dotted text-success ms-1 fs-4"></i>
            </>
          )
        }
        onSubmit={handleSubmit}
        isLoading={isLoading}
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
