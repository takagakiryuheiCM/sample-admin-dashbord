import { Route, Routes } from "react-router-dom";
import { MemberListPage } from "@/features/members";
import { HomePage} from "@/features/home";

export const Router = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/members" element={<MemberListPage />} />
  </Routes>
);
