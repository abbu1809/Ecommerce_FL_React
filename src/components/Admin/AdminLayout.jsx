import { Link, Outlet } from "react-router-dom";

const AdminLayout = () => {
  // TODO: Add more navigation links as needed
  const navLinks = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Products", path: "/admin/products" }, // Example link
    { name: "Orders", path: "/admin/orders" }, // Example link
    { name: "Users", path: "/admin/users" }, // Example link
  ];

  return (
    <div className="flex h-screen bg-bg-secondary">
      {/* Sidebar */}
      <aside className="w-64 bg-bg-dark text-text-on-dark-bg p-4 space-y-4">
        <div className="text-xl font-bold text-brand-primary mb-6">
          Admin Panel
        </div>
        <nav>
          <ul className="space-y-2">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.path}
                  className="block px-3 py-2 rounded-md hover:bg-gray-700 transition-colors duration-150"
                  // TODO: Add active link styling
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-auto pt-4 border-t border-border-dark">
          <Link
            to="/"
            className="block px-3 py-2 rounded-md hover:bg-gray-700 transition-colors duration-150 text-sm"
          >
            Back to Site
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet /> {/* Nested routes will render here */}
      </main>
    </div>
  );
};

export default AdminLayout;
