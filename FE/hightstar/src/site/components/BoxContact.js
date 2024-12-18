import React, { useState, useEffect } from "react";

const BoxContact = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    isVisible && (
      <div className="icon-container ms-sm-3 mb-sm-3">
        <a
          href="https://zalo.me/0366675206"
          className="icon icon-zalo mb-3"
          title="Chat với tôi qua Zalo"
        >
          <img src="/assets/img/Logo-Zalo-App.webp" alt="Zalo Icon" />
        </a>
        <a
          href="https://www.facebook.com/profile.php?id=61570918401577"
          className="icon icon-fb mb-3"
          title="Liên hệ qua Facebook"
        >
          <img src="/assets/img/icon-facebook.png" alt="Facebook Icon" />
        </a>
        <a href="tel:0888372325" className="icon icon-phone" title="Gọi điện thoại">
          <img src="/assets/img/phone-call.png" alt="Phone Icon" />
        </a>
      </div>
    )
  );
};

export default BoxContact;
