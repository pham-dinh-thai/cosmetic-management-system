import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import ErrorBoundary from "./components/ErrorBoundary";
import { AuthProvider } from "./contexts/AuthProvider";
import { useAuthStore } from "./store/useAuthStore";
import { canWriteSuppliers } from "./lib/permissions";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Resources from "./pages/Resources";
import ProductDetail from "./pages/ProductDetail";
import CategoryPage from "./pages/CategoryPage";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import ProfilePage from "./pages/Profile";
import MyOrdersPage from "./pages/MyOrders";
import NotFound from "./pages/NotFound";
import RoleRoute from "./components/RoleRoute";
import type React from "react";

const AdminSuppliersWrite: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = useAuthStore((s) => s.user);
  return canWriteSuppliers(user) ? <>{children}</> : <NotFound />;
};

import OverviewPage from "./pages/Admin/routes/Overview";
import CustomersPage from "./pages/Admin/routes/Customers";
import AddCustomerPage from "./pages/Admin/routes/AddCustomer";
import EditCustomerPage from "./pages/Admin/routes/EditCustomer";
import EmployeesPage from "./pages/Admin/routes/Employees";
import AddEmployeePage from "./pages/Admin/routes/AddEmployee";
import EditEmployeePage from "./pages/Admin/routes/EditEmployee";
import DepartmentsPage from "./pages/Admin/routes/Departments";
import AddDepartmentPage from "./pages/Admin/routes/AddDepartment";
import EditDepartmentPage from "./pages/Admin/routes/EditDepartment";
import SuppliersPage from "./pages/Admin/routes/Suppliers";
import AddSupplierPage from "./pages/Admin/routes/AddSupplier";
import EditSupplierPage from "./pages/Admin/routes/EditSupplier";
import ProductsPage from "./pages/Admin/routes/Products";
import AddProductPage from "./pages/Admin/routes/AddProduct";
import EditProductPage from "./pages/Admin/routes/EditProduct";
import ProductDetailAdminPage from "./pages/Admin/routes/ProductDetailAdmin";
import CategoriesPage from "./pages/Admin/routes/Categories";
import PurchaseOrdersPage from "./pages/Admin/routes/PurchaseOrders";
import AddPurchaseOrderPage from "./pages/Admin/routes/AddPurchaseOrder";
import EditPurchaseOrderPage from "./pages/Admin/routes/EditPurchaseOrder";
import InventoryPage from "./pages/Admin/routes/Inventory";
import AddInventoryPage from "./pages/Admin/routes/AddInventory";
import EditInventoryPage from "./pages/Admin/routes/EditInventory";
import InventoryDetailPage from "./pages/Admin/routes/InventoryDetail";
import ImportPurchaseOrderPage from "./pages/Admin/routes/ImportPurchaseOrder";
import StockAdjustmentsPage from "./pages/Admin/routes/StockAdjustments";
import StockAdjustmentsHistoryPage from "./pages/Admin/routes/StockAdjustmentsHistory";
import ReceiptsPage from "./pages/Admin/routes/Receipts";
import PaymentsPage from "./pages/Admin/routes/Payments";
import InvoicesPage from "./pages/Admin/routes/Invoices";
import OrdersPage from "./pages/Admin/routes/Orders";
import PosPage from "./pages/Employee/routes/POS";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ErrorBoundary>
          <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/product/:code" element={<ProductDetail />} />
          <Route path="/category/:id" element={<CategoryPage />} />
          <Route
            path="/profile"
            element={
              <RoleRoute allowedRoles={["admin", "employee", "customer"]}>
                <ProfilePage />
              </RoleRoute>
            }
          />
          <Route
            path="/my-orders"
            element={
              <RoleRoute allowedRoles={["admin", "employee", "customer"]}>
                <MyOrdersPage />
              </RoleRoute>
            }
          />

          <Route
            element={
              <RoleRoute allowedRoles={["admin", "employee"]}>
                <Resources />
              </RoleRoute>
            }
          >
            <Route path="/overview" element={<OverviewPage />} />
            <Route path="/pos" element={<PosPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/customers/add" element={<AddCustomerPage />} />
            <Route path="/customers/:id/edit" element={<EditCustomerPage />} />
            <Route path="/employees" element={<EmployeesPage />} />
            <Route path="/employees/add" element={<AddEmployeePage />} />
            <Route path="/employees/:id/edit" element={<EditEmployeePage />} />
            <Route path="/departments" element={<DepartmentsPage />} />
            <Route path="/departments/add" element={<AddDepartmentPage />} />
            <Route path="/departments/:id/edit" element={<EditDepartmentPage />} />
            <Route path="/suppliers" element={<SuppliersPage />} />
            <Route path="/suppliers/add" element={<AdminSuppliersWrite><AddSupplierPage /></AdminSuppliersWrite>} />
            <Route path="/suppliers/:id/edit" element={<AdminSuppliersWrite><EditSupplierPage /></AdminSuppliersWrite>} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/add" element={<AddProductPage />} />
            <Route path="/products/:id/edit" element={<EditProductPage />} />
            <Route path="/products/:id" element={<ProductDetailAdminPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/purchase" element={<PurchaseOrdersPage />} />
            <Route path="/purchase/add" element={<AddPurchaseOrderPage />} />
            <Route path="/purchase/:id/edit" element={<EditPurchaseOrderPage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/inventory/import" element={<ImportPurchaseOrderPage />} />
            <Route path="/stock-adjustments" element={<StockAdjustmentsPage />} />
            <Route path="/stock-adjustments/history" element={<StockAdjustmentsHistoryPage />} />
            <Route path="/receipts" element={<ReceiptsPage />} />
            <Route path="/payments" element={<PaymentsPage />} />
            <Route path="/invoices" element={<InvoicesPage />} />
            <Route path="/inventory/add" element={<AddInventoryPage />} />
            <Route path="/inventory/:id/edit" element={<EditInventoryPage />} />
            <Route path="/inventory/:id" element={<InventoryDetailPage />} />
          </Route>

          <Route path="*" element={<NotFound />} />
          </Routes>
        </ErrorBoundary>
      </BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#fcfcf7",
            color: "#1c3a13",
            border: "1px solid #1c3a13",
          },
        }}
      />
    </AuthProvider>
  );
}

export default App;