import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
// import LoginRegisterOTP from "../Component/Login/LoginRegisterOTP";
import LoginComponent from "../Component/Login/Login";
import LoginForgotPassword from "../Component/Login/LoginForgetPassword";
import ChangePasswordComponent from "../Component/Login/ChangePswValidation";
import Footer from "../Component/Footer/Footer";
import AllLoadsDetailsTL from "../Component/AllLoads/AllLoadsDetailsTL";
// import AllLoadsDetailsintermodel from "../Component/AllLoads/AllLoadsDetailsIntermodel";
import BookLtl from "../Component/BookLtl/BookLtl";
import AdminUserForm from "../Component/Admin/AdminAddUser";
import UserSummaryGrid from "../Component/Admin/AdminLandingGrid";
import QuoteLtlChooseYourCarrier from "../Component/QuoteLtl/QuoteLtlChooseYourCarrier";
import QuoteLtl from "../Component/QuoteLtl/QuoteLtl";
import CreateLtl from "../Component/CreateTl/CreateLtl";
import AllLoadsGrid from "../Component/AllLoads/AllLoadGrid";
import HeaderComponent from "../Component/Menu/HeaderComponent";
import { useContext } from "react";
import { UserContext } from "../app/Context";

export const AppRoutes = () => {
  const context = useContext(UserContext);
  const currentUserStatus = context.GetCurrentUserValue();

  return (
    <div>
      {
        currentUserStatus == false ? (
          <div className="container-fluid footer-trial container-pos-rel">
            <Routes>
              {/* redirect to login */}
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="/login" element={<LoginComponent />} />
              {/* redirect to forgot password */}
              <Route path="/ForgotPassword" element={<LoginForgotPassword />} />
              {/* redirect to changePassword and verify email screen */}
              <Route path="/login/:slug" element={<LoginComponent />} />
              <Route path="/changePassword" element={<ChangePasswordComponent />} />
              {/* redirect to login when user not signin */}
              <Route path="/loadsearch" element={<Navigate to="/login" />} />
              <Route path="/al-details-tl" element={<Navigate to="/login" />} />
              <Route path="/al-details-tl" element={<Navigate to="/login" />} />
              <Route path="/admin-add-user" element={<Navigate to="/login" />} />
              <Route path="/admin-view-user" element={<Navigate to="/login" />} />
              <Route path="/admin-edit-user" element={<Navigate to="/login" />} />
              <Route path="/admin-landing-grid" element={<Navigate to="/login" />} />
              <Route path="/create-tl" element={<Navigate to="/login" />} />
              <Route path="/quoteltl" element={<Navigate to="/login" />} />
              <Route path="/quoteltl-choose-carrier" element={<Navigate to="/login" />} />
              <Route path="/bookltl" element={<Navigate to="/login" />} />
            </Routes>
          </div>
        ) :
          <div className="container-fluid">
            <HeaderComponent />
            <Routes>
              {/* redirect to load search */}
              <Route path="/" element={<Navigate to="/loadsearch" />} />
              <Route path="/login" element={<Navigate to="/loadsearch" />} />
              <Route path="/login/verifyEmailPhone" element={<Navigate to="/loadsearch" />} />
              <Route path="/loadsearch" element={<AllLoadsGrid />} />
              <Route path="/al-details-tl" element={<AllLoadsDetailsTL />} />
              {/* <Route path="/al-details-intermodel" element={<AllLoadsDetailsintermodel />} /> */}
              <Route path="/admin-user-form/:pMode" element={<AdminUserForm />} />
              <Route path="/admin-user-summary" element={<UserSummaryGrid />} />
              <Route path="/create-tl" element={<CreateLtl />} />
              {/* redirect to quote Ltl */}
              <Route path="/quoteltl" element={<QuoteLtl />} />
              {/* redirect to book ltl */}
              <Route path="/bookltl" element={<BookLtl />} />
              {/* redirect to choose carrier */}
              <Route path="/quoteltl-choose-carrier" element={<QuoteLtlChooseYourCarrier />} />
            </Routes>
            <Footer />
          </div>
      }
    </div>
  )
}