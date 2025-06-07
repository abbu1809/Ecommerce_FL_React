import Button from "../../ui/Button";

const ReturnDetail = ({ return: returnData }) => {
  if (!returnData) return null;

  const getStatusColor = (status) => {
    const statusColors = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      completed: "bg-blue-100 text-blue-800",
    };

    return statusColors[status] || statusColors.pending;
  };

  return (
    <div className="bg-white rounded-lg shadow-md h-full">
      <div className="p-6 border-b">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Return Request</h2>
            <p className="text-sm text-gray-500">Return #{returnData.id}</p>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(
              returnData.status
            )}`}
          >
            {returnData.status}
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div>
          <h3 className="font-medium text-gray-700 mb-2">
            Request Information
          </h3>
          <div className="bg-gray-50 rounded divide-y divide-gray-200">
            <div className="p-3 flex justify-between">
              <span className="text-sm text-gray-500">Order ID</span>
              <span className="text-sm font-medium">{returnData.orderId}</span>
            </div>
            <div className="p-3 flex justify-between">
              <span className="text-sm text-gray-500">Customer</span>
              <span className="text-sm font-medium">{returnData.customer}</span>
            </div>
            <div className="p-3 flex justify-between">
              <span className="text-sm text-gray-500">Request Date</span>
              <span className="text-sm font-medium">
                {returnData.requestDate}
              </span>
            </div>
            <div className="p-3 flex justify-between">
              <span className="text-sm text-gray-500">Refund Amount</span>
              <span className="text-sm font-medium">
                ${returnData.refundAmount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-medium text-gray-700 mb-2">Return Reason</h3>
          <div className="bg-gray-50 p-3 rounded">
            <p className="text-sm font-medium">{returnData.details.reason}</p>
            <p className="text-sm text-gray-600 mt-2">
              {returnData.details.description}
            </p>
          </div>
        </div>

        <div>
          <h3 className="font-medium text-gray-700 mb-2">Items to Return</h3>
          <div className="bg-gray-50 rounded overflow-hidden divide-y divide-gray-200">
            {returnData.items.map((item) => (
              <div key={item.id} className="p-3 flex justify-between">
                <div>
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-gray-500">
                    Qty: {item.quantity} | Reason: {item.reason}
                  </p>
                </div>
                <p className="text-sm font-medium">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {returnData.details.images && returnData.details.images.length > 0 && (
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Images</h3>
            <div className="grid grid-cols-2 gap-3">
              {returnData.details.images.map((image, index) => (
                <div
                  key={index}
                  className="rounded overflow-hidden border border-gray-200"
                >
                  <img
                    src={image}
                    alt={`Return image ${index + 1}`}
                    className="w-full h-auto"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h3 className="font-medium text-gray-700 mb-2">Return Timeline</h3>
          <div className="space-y-3">
            {returnData.timeline.map((event, index) => (
              <div key={index} className="flex">
                <div className="mr-3 relative">
                  <div className="h-3 w-3 rounded-full bg-blue-500 ring-4 ring-blue-100"></div>
                  {index < returnData.timeline.length - 1 && (
                    <div className="h-full w-0.5 bg-gray-200 absolute top-3 left-1.5"></div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{event.status}</p>
                  <p className="text-xs text-gray-500">{event.comment}</p>
                  <p className="text-xs text-gray-400 mt-1">{event.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 border-t bg-gray-50 flex justify-end space-x-3">
        {returnData.status === "pending" && (
          <>
            <Button variant="danger">Reject Return</Button>
            <Button variant="primary">Approve Return</Button>
          </>
        )}
        {returnData.status === "approved" && (
          <Button variant="primary">Mark as Completed</Button>
        )}
        <Button variant="secondary">Print Details</Button>
      </div>
    </div>
  );
};

export default ReturnDetail;
