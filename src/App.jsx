import { useEffect } from "react";

import {
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import Home from "./pages/Home/Home";
import Properties from "./pages/Properties/Properties";
import PropertyDetails from "./pages/PropertyDetails/PropertyDetails";
import MortgageApplication from "./pages/MortgageApplication/MortgageApplication";
import AdminProperties from "./pages/AdminProperties/AdminProperties";
import AdminLogin from "./pages/AdminLogin/AdminLogin";

import {
  AdminAuthProvider,
  ProtectedAdminRoute,
} from "./auth/AdminAuth";

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}

function PlaceholderPage({ title }) {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "40px",
      }}
    >
      <h1>{title}</h1>
    </main>
  );
}

export default function App() {
  return (
    <AdminAuthProvider>
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/properties" element={<Properties />} />

        <Route
          path="/properties/:propertyId"
          element={<PropertyDetails />}
        />

        <Route
          path="/mortgage"
          element={<MortgageApplication />}
        />

        <Route
          path="/contact"
          element={<PlaceholderPage title="Contact" />}
        />

        <Route
          path="/mortgage-calculator"
          element={<PlaceholderPage title="Mortgage Calculator" />}
        />

        <Route
          path="/branch-locator"
          element={<PlaceholderPage title="Branch Locator" />}
        />

        <Route
          path="/dealer"
          element={<PlaceholderPage title="Dealer Portal" />}
        />

        <Route
          path="/about"
          element={<PlaceholderPage title="About Haggai Homes" />}
        />

        <Route
          path="/privacy"
          element={<PlaceholderPage title="Privacy Policy" />}
        />

        <Route
          path="/terms"
          element={<PlaceholderPage title="Terms of Service" />}
        />

        <Route path="/admin/login" element={<AdminLogin />} />

        <Route element={<ProtectedAdminRoute />}>
          <Route
            path="/admin/properties"
            element={<AdminProperties />}
          />

          <Route
            path="/admin"
            element={<Navigate to="/admin/properties" replace />}
          />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AdminAuthProvider>
  );
}