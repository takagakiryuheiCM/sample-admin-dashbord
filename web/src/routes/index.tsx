import { MemberEditPage, MemberListPage } from "@/features/members"
import { Route, Routes } from "react-router-dom"

export const Router = () => (
  <Routes>
    <Route path="/" element={<MemberListPage />} />
    <Route path="/edit/:id" element={<MemberEditPage />} />
  </Routes>
)
