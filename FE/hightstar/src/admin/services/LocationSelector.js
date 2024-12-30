import React, { useState, useEffect } from "react";
import axios from "axios";

const LocationSelector = () => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");

  // Lấy danh sách tỉnh khi component mount
  useEffect(() => {
    axios.get("https://esgoo.net/api-tinhthanh/1/0.htm").then((response) => {
      if (response.data.error === 0) {
        setProvinces(response.data.data);
      }
    });
  }, []);

  // Lấy danh sách huyện khi chọn tỉnh
  const handleProvinceChange = (provinceId) => {
    setSelectedProvince(provinceId);
    setDistricts([]); // Reset danh sách huyện
    setWards([]); // Reset danh sách xã
    if (provinceId) {
      axios.get(`https://esgoo.net/api-tinhthanh/2/${provinceId}.htm`).then((response) => {
        if (response.data.error === 0) {
          setDistricts(response.data.data);
        }
      });
    }
  };

  // Lấy danh sách xã khi chọn huyện
  const handleDistrictChange = (districtId) => {
    setSelectedDistrict(districtId);
    setWards([]); // Reset danh sách xã
    if (districtId) {
      axios.get(`https://esgoo.net/api-tinhthanh/3/${districtId}.htm`).then((response) => {
        if (response.data.error === 0) {
          setWards(response.data.data);
        }
      });
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ marginBottom: "10px" }}>
        <select
          style={{ width: "25%", padding: "5px", margin: "5px", borderRadius: "5px" }}
          onChange={(e) => handleProvinceChange(e.target.value)}
        >
          <option value="">Chọn Tỉnh/Thành phố</option>
          {provinces.map((province) => (
            <option key={province.id} value={province.id}>
              {province.full_name}
            </option>
          ))}
        </select>
      </div>
      <div style={{ marginBottom: "10px" }}>
        <select
          style={{ width: "25%", padding: "5px", margin: "5px", borderRadius: "5px" }}
          onChange={(e) => handleDistrictChange(e.target.value)}
          disabled={!selectedProvince}
        >
          <option value="">Chọn Quận/Huyện</option>
          {districts.map((district) => (
            <option key={district.id} value={district.id}>
              {district.full_name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <select
          style={{ width: "25%", padding: "5px", margin: "5px", borderRadius: "5px" }}
          disabled={!selectedDistrict}
        >
          <option value="">Chọn Xã/Phường</option>
          {wards.map((ward) => (
            <option key={ward.id} value={ward.id}>
              {ward.full_name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default LocationSelector;
