import { HomePage } from "@/features/home"
import { MemberEditPage, MemberListPage } from "@/features/members"
import { Route, Routes } from "react-router-dom"

export const Router = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/members" element={<MemberListPage />} />
    <Route path="/members/edit/:id" element={<MemberEditPage />} />
  </Routes>
)
