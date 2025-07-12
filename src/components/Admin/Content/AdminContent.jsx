import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import CategoryManager from "./CategoryManager";
import LogoManager from "./LogoManager";
import BannerManager from "./BannerManager";
import PromotionManager from "./PromotionManager";
import HomepageSectionManager from "./HomepageSectionManager";

const AdminContent = () => {
  return (
    <div className="p-6">
      <Routes>
        <Route path="categories" element={<CategoryManager />} />
        <Route path="logo" element={<LogoManager />} />
        <Route path="banners" element={<BannerManager />} />
        <Route path="promotions" element={<PromotionManager />} />
        <Route path="homepage-sections" element={<HomepageSectionManager />} />
        <Route path="*" element={<Navigate to="categories" replace />} />
      </Routes>
    </div>
  );
};

export default AdminContent;
