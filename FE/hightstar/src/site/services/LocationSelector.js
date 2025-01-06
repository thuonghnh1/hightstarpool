import React, { useState, useEffect } from "react";
import axios from "axios";


const LocationSelector = ({ value, onChange }) => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");

  useEffect(() => {
    axios.get("https://esgoo.net/api-tinhthanh/1/0.htm").then((response) => {
      if (response.data.error === 0) {
        setProvinces(response.data.data);
      }
    });
  }, []);

  const handleProvinceChange = (provinceId) => {
    setSelectedProvince(provinceId);
    setDistricts([]);
    setWards([]);
    setSelectedDistrict("");
    setSelectedWard("");

    const selectedProvinceName = provinces.find((p) => p.id === provinceId)?.full_name || "";

    if (provinceId) {
      axios.get(`https://esgoo.net/api-tinhthanh/2/${provinceId}.htm`).then((response) => {
        if (response.data.error === 0) {
          setDistricts(response.data.data);
        }
      });
    }

    // Gửi thông tin địa chỉ qua onChange
    onChange(`${selectedProvinceName}`);
  };

  const handleDistrictChange = (districtId) => {
    setSelectedDistrict(districtId);
    setWards([]);
    setSelectedWard("");

    const selectedProvinceName = provinces.find((p) => p.id === selectedProvince)?.full_name || "";
    const selectedDistrictName = districts.find((d) => d.id === districtId)?.full_name || "";

    if (districtId) {
      axios.get(`https://esgoo.net/api-tinhthanh/3/${districtId}.htm`).then((response) => {
        if (response.data.error === 0) {
          setWards(response.data.data);
        }
      });
    }

    // Gửi thông tin địa chỉ qua onChange
    onChange(`${selectedDistrictName}, ${selectedProvinceName}`);
  };

  const handleWardChange = (wardId) => {
    setSelectedWard(wardId);

    const selectedProvinceName = provinces.find((p) => p.id === selectedProvince)?.full_name || "";
    const selectedDistrictName = districts.find((d) => d.id === selectedDistrict)?.full_name || "";
    const selectedWardName = wards.find((w) => w.id === wardId)?.full_name || "";

    // Gửi thông tin địa chỉ qua onChange
    onChange(`${selectedWardName}, ${selectedDistrictName}, ${selectedProvinceName}`);
  };


  return (
    <div style={{ textAlign: "center", display: "flex", justifyContent: "space-between" }}>
      <div style={{ width: "30%" }}>
        <select
          style={{ width: "100%", padding: "5px", borderRadius: "5px" }}
          onChange={(e) => handleProvinceChange(e.target.value)}
          value={selectedProvince}
        >
          <option value="">Chọn Tỉnh/Thành phố</option>
          {provinces.map((province) => (
            <option key={province.id} value={province.id}>
              {province.full_name}
            </option>
          ))}
        </select>
      </div>
      <div style={{ width: "30%" }}>
        <select
          style={{ width: "100%", padding: "5px", borderRadius: "5px" }}
          onChange={(e) => handleDistrictChange(e.target.value)}
          value={selectedDistrict}
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
      <div style={{ width: "30%" }}>
        <select
          style={{ width: "100%", padding: "5px", borderRadius: "5px" }}
          onChange={(e) => handleWardChange(e.target.value)}
          value={selectedWard}
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
