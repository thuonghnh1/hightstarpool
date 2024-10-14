import { useState } from "react";
import { Form, Pagination, Dropdown, DropdownButton } from "react-bootstrap";
import CustomModal from "./CustomModal";
import "../../css/table-management.css";

const TableManagement = ({
  data,
  columns,
  title,
  defaultColumns,
  modalContent,
  isEditing,
  validateForm,
  handleAddNew,
  handleEdit,
  handleSaveItem,
}) => {
  const [visibleColumns, setVisibleColumns] = useState(
    defaultColumns.map((col) => col.key)
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });
  const [showModal, setShowModal] = useState(false); // State để quản lý hiển thị modal

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const sortedData = [...data].sort((a, b) => {
    if (sortConfig.key) {
      let compareA = a[sortConfig.key];
      let compareB = b[sortConfig.key];

      if (typeof compareA === "string") {
        compareA = compareA.toLowerCase();
        compareB = compareB.toLowerCase();
      }

      if (sortConfig.direction === "asc") {
        return compareA > compareB ? 1 : -1;
      } else {
        return compareA < compareB ? 1 : -1;
      }
    }
    return 0;
  });

  const filteredData = sortedData.filter((item) => {
    return visibleColumns.some((key) =>
      item[key]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleColumnToggle = (key) => {
    setVisibleColumns((prevColumns) => {
      if (prevColumns.includes(key)) {
        return prevColumns.filter((colKey) => colKey !== key);
      } else {
        return [...prevColumns, key];
      }
    });
  };

  // Xử lý khi mở modal thêm item
  const handleShowModal = () => {
    setShowModal(true);
  };

  // Xử lý khi đóng modal
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Xử lý khi nhấn nút lưu (submit)
  const handleSubmit = () => {
    if (validateForm()) {
      handleSaveItem(); // Gọi hàm từ cha khi form hợp lệ
      handleCloseModal(); // Đóng modal sau khi lưu thành công
    }
  };
  return (
    <section className="row m-0 bg-white p-0 w-100 rounded-4">
      <div className="col-12 p-4">
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
                handleAddNew();
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
          <div className="light__text col-12 p-0 table-responsive">
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
                  <tr key={item.id}>
                    {columns
                      .filter((col) => visibleColumns.includes(col.key))
                      .map((column) => (
                        <td key={column.key} className="align-middle">{item[column.key]}</td>
                      ))}
                    <td>
                      <button
                        className="btn btn__edit me-3 p-1"
                        onClick={() => {
                          handleEdit(item);
                          handleShowModal();
                        }}
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button className="btn btn__delete p-1">
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
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
            <Pagination.First onClick={() => handlePageChange(1)} />
            {[...Array(totalPages).keys()].map((page) => (
              <Pagination.Item
                key={page + 1}
                active={page + 1 === currentPage}
                onClick={() => handlePageChange(page + 1)}
              >
                {page + 1}
              </Pagination.Item>
            ))}
            <Pagination.Last onClick={() => handlePageChange(totalPages)} />
          </Pagination>
        </div>
      </div>
      {/* Modal Thêm Item */}
      <CustomModal
        show={showModal}
        handleClose={handleCloseModal}
        title={isEditing ? "Cập nhật bản ghi" : "Thêm mới bản ghi"}
        onSubmit={handleSubmit}
      >
        {/* Truyền children modal thông qua props */}
        {modalContent}
      </CustomModal>
    </section>
  );
};

export default TableManagement;
