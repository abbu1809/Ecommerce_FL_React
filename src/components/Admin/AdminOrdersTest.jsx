// Test component to verify admin orders API integration
import { useState } from "react";
import useAdminStore from "../store/Admin/useAdminStore";

const AdminOrdersTest = () => {
  const [testResults, setTestResults] = useState({});
  const [isRunning, setIsRunning] = useState(false);

  const {
    orders,
    fetchOrders,
    updateOrderStatus,
    getUserById,
    getProductById,
    fetchDeliveryPartners,
  } = useAdminStore();

  const runTests = async () => {
    setIsRunning(true);
    const results = {};

    try {
      // Test 1: Fetch Orders
      console.log("Testing: Fetch Orders...");
      await fetchOrders();
      results.fetchOrders = {
        success: true,
        message: `Fetched ${orders.list.length} orders`,
        data: orders.list.slice(0, 2), // Show first 2 orders
      };
    } catch (error) {
      results.fetchOrders = {
        success: false,
        message: error.message,
        error: error,
      };
    }

    try {
      // Test 2: Get User by ID (if we have orders)
      if (orders.list.length > 0) {
        console.log("Testing: Get User by ID...");
        const userId = orders.list[0].user_id;
        const user = await getUserById(userId);
        results.getUserById = {
          success: true,
          message: `Fetched user: ${user.email || user.username || "N/A"}`,
          data: user,
        };
      }
    } catch (error) {
      results.getUserById = {
        success: false,
        message: error.message,
        error: error,
      };
    }

    try {
      // Test 3: Get Product by ID (if we have orders with items)
      if (orders.list.length > 0 && orders.list[0].order_items?.length > 0) {
        console.log("Testing: Get Product by ID...");
        const productId = orders.list[0].order_items[0].product_id;
        const product = await getProductById(productId);
        results.getProductById = {
          success: true,
          message: `Fetched product: ${product.name || "N/A"}`,
          data: product,
        };
      }
    } catch (error) {
      results.getProductById = {
        success: false,
        message: error.message,
        error: error,
      };
    }

    try {
      // Test 4: Fetch Delivery Partners
      console.log("Testing: Fetch Delivery Partners...");
      const partners = await fetchDeliveryPartners();
      results.fetchDeliveryPartners = {
        success: true,
        message: `Fetched ${partners.length} delivery partners`,
        data: partners.slice(0, 2), // Show first 2 partners
      };
    } catch (error) {
      results.fetchDeliveryPartners = {
        success: false,
        message: error.message,
        error: error,
      };
    }

    setTestResults(results);
    setIsRunning(false);
  };

  const testUpdateOrderStatus = async () => {
    if (orders.list.length === 0) {
      alert("No orders available to test with");
      return;
    }

    const orderId = orders.list[0].order_id;
    const currentStatus = orders.list[0].status;
    const testStatus =
      currentStatus === "pending_payment" ? "processing" : "pending_payment";

    try {
      await updateOrderStatus(orderId, testStatus);
      alert(
        `Successfully updated order ${orderId.substring(
          0,
          8
        )} status to ${testStatus}`
      );
    } catch (error) {
      alert(`Failed to update order status: ${error.message}`);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2>Admin Orders API Integration Test</h2>
      <p>
        This component tests the integration between the React frontend and
        Django backend for admin orders.
      </p>

      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={runTests}
          disabled={isRunning}
          style={{
            padding: "10px 20px",
            backgroundColor: "#4F46E5",
            color: "white",
            border: "none",
            borderRadius: "5px",
            marginRight: "10px",
            cursor: isRunning ? "not-allowed" : "pointer",
          }}
        >
          {isRunning ? "Running Tests..." : "Run API Tests"}
        </button>

        <button
          onClick={testUpdateOrderStatus}
          disabled={isRunning || orders.list.length === 0}
          style={{
            padding: "10px 20px",
            backgroundColor: "#10B981",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor:
              isRunning || orders.list.length === 0 ? "not-allowed" : "pointer",
          }}
        >
          Test Update Order Status
        </button>
      </div>

      {Object.keys(testResults).length > 0 && (
        <div>
          <h3>Test Results:</h3>
          {Object.entries(testResults).map(([testName, result]) => (
            <div
              key={testName}
              style={{
                margin: "10px 0",
                padding: "15px",
                border: `2px solid ${result.success ? "#10B981" : "#EF4444"}`,
                borderRadius: "5px",
                backgroundColor: result.success ? "#F0FDF4" : "#FEF2F2",
              }}
            >
              <h4
                style={{
                  margin: "0 0 10px 0",
                  color: result.success ? "#047857" : "#DC2626",
                }}
              >
                {testName}: {result.success ? "✅ PASS" : "❌ FAIL"}
              </h4>
              <p style={{ margin: "5px 0" }}>{result.message}</p>
              {result.data && (
                <details style={{ marginTop: "10px" }}>
                  <summary style={{ cursor: "pointer", fontWeight: "bold" }}>
                    View Data
                  </summary>
                  <pre
                    style={{
                      background: "#f5f5f5",
                      padding: "10px",
                      borderRadius: "3px",
                      overflow: "auto",
                      fontSize: "12px",
                      maxHeight: "200px",
                    }}
                  >
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </details>
              )}
              {result.error && (
                <details style={{ marginTop: "10px" }}>
                  <summary
                    style={{
                      cursor: "pointer",
                      fontWeight: "bold",
                      color: "#DC2626",
                    }}
                  >
                    View Error Details
                  </summary>
                  <pre
                    style={{
                      background: "#FEE2E2",
                      padding: "10px",
                      borderRadius: "3px",
                      overflow: "auto",
                      fontSize: "12px",
                      maxHeight: "200px",
                      color: "#DC2626",
                    }}
                  >
                    {result.error.toString()}
                  </pre>
                </details>
              )}
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: "30px" }}>
        <h3>Current Orders in Store:</h3>
        <p>Total Orders: {orders.list.length}</p>
        <p>Loading: {orders.loading ? "Yes" : "No"}</p>

        {orders.list.length > 0 && (
          <details>
            <summary style={{ cursor: "pointer", fontWeight: "bold" }}>
              View First Order
            </summary>
            <pre
              style={{
                background: "#f5f5f5",
                padding: "10px",
                borderRadius: "3px",
                overflow: "auto",
                fontSize: "12px",
                maxHeight: "300px",
              }}
            >
              {JSON.stringify(orders.list[0], null, 2)}
            </pre>
          </details>
        )}
      </div>

      <div
        style={{
          marginTop: "30px",
          padding: "15px",
          backgroundColor: "#FEF3C7",
          borderRadius: "5px",
        }}
      >
        <h3>⚠️ Important Notes:</h3>
        <ul>
          <li>
            Make sure your Django backend is running on{" "}
            <code>http://127.0.0.1:8000</code>
          </li>
          <li>
            Ensure you have proper CORS configuration in Django to allow
            frontend requests
          </li>
          <li>
            Check that all API endpoints are properly implemented in Django
          </li>
          <li>
            Verify that admin authentication is working (admin token in
            localStorage)
          </li>
          <li>
            Firebase order data should be accessible through the Django
            endpoints
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AdminOrdersTest;
