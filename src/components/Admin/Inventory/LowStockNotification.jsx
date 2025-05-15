import { useState } from "react";
import Button from "../../UI/Button";
import { useProductStore } from "../../../store/useProduct";

const LowStockNotification = () => {
  const { products } = useProductStore();
  const [threshold, setThreshold] = useState(10);

  const lowStockItems = products.filter(
    (product) => product.quantity < threshold
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Low Stock Alerts
        </h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Threshold:</span>
          <input
            type="number"
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
            className="w-16 border border-gray-300 rounded px-2 py-1 text-sm"
            min="1"
          />
        </div>
      </div>

      {lowStockItems.length > 0 ? (
        <div>
          <div className="grid grid-cols-12 bg-gray-100 py-2 px-4 rounded-t font-medium text-gray-700 text-sm">
            <div className="col-span-1">#</div>
            <div className="col-span-5">Product</div>
            <div className="col-span-2">SKU</div>
            <div className="col-span-2">Quantity</div>
            <div className="col-span-2">Action</div>
          </div>

          <div className="divide-y divide-gray-100 max-h-64 overflow-y-auto">
            {lowStockItems.map((item, index) => (
              <div
                key={item.id}
                className="grid grid-cols-12 py-3 px-4 items-center text-sm"
              >
                <div className="col-span-1 text-gray-500">{index + 1}</div>
                <div className="col-span-5 font-medium">{item.title}</div>
                <div className="col-span-2 text-gray-600">
                  {item.sku || "SKU-" + item.id}
                </div>
                <div className="col-span-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.quantity <= 5
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {item.quantity} left
                  </span>
                </div>
                <div className="col-span-2">
                  <Button variant="primary" size="sm">
                    Restock
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>No products below the threshold</p>
        </div>
      )}
    </div>
  );
};

export default LowStockNotification;
