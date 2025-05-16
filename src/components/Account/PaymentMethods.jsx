import React from "react";
import { FiCreditCard, FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";

const PaymentMethods = () => {
  const [paymentMethods, setPaymentMethods] = React.useState([
    {
      id: 1,
      type: "Credit Card",
      name: "John Doe",
      cardNumber: "•••• •••• •••• 1234",
      expiry: "12/25",
      isDefault: true,
    },
    {
      id: 2,
      type: "Debit Card",
      name: "John Doe",
      cardNumber: "•••• •••• •••• 5678",
      expiry: "08/26",
      isDefault: false,
    },
  ]);

  const [isAddingCard, setIsAddingCard] = React.useState(false);
  const [editingCardId, setEditingCardId] = React.useState(null);
  const [formData, setFormData] = React.useState({
    type: "Credit Card",
    name: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
    isDefault: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEditCard = (card) => {
    setFormData({
      ...card,
      cardNumber: "", // For security, we don't pre-fill the card number
      cvv: "",
    });
    setEditingCardId(card.id);
    setIsAddingCard(true);
  };

  const handleDeleteCard = (id) => {
    setPaymentMethods(paymentMethods.filter((card) => card.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Mask the card number for display
    const maskedCardNumber = `•••• •••• •••• ${formData.cardNumber.slice(-4)}`;

    if (editingCardId) {
      // Update existing card
      setPaymentMethods(
        paymentMethods.map((card) =>
          card.id === editingCardId
            ? {
                ...formData,
                id: editingCardId,
                cardNumber: maskedCardNumber,
              }
            : card
        )
      );
    } else {
      // Add new card
      const newCard = {
        ...formData,
        id: Date.now(),
        cardNumber: maskedCardNumber,
      };
      setPaymentMethods([...paymentMethods, newCard]);
    }

    // Reset form
    setFormData({
      type: "Credit Card",
      name: "",
      cardNumber: "",
      expiry: "",
      cvv: "",
      isDefault: false,
    });
    setIsAddingCard(false);
    setEditingCardId(null);
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md p-6"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2
          className="text-xl font-semibold"
          style={{ color: "var(--text-primary)" }}
        >
          Payment Methods
        </h2>

        {!isAddingCard && (
          <button
            onClick={() => setIsAddingCard(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:opacity-90"
            style={{
              backgroundColor: "var(--brand-primary)",
              color: "var(--text-on-brand)",
            }}
          >
            <FiPlus className="w-4 h-4" />
            <span>Add New Card</span>
          </button>
        )}
      </div>

      {isAddingCard ? (
        <div
          className="border rounded-lg p-4 mb-6"
          style={{ borderColor: "var(--border-primary)" }}
        >
          <h3
            className="text-lg font-medium mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            {editingCardId ? "Update Card" : "Add New Card"}
          </h3>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="type"
                  className="block text-sm font-medium mb-2"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Card Type
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
                  style={{
                    borderColor: "var(--border-primary)",
                    color: "var(--text-primary)",
                    backgroundColor: "var(--bg-secondary)",
                    focusRing: "var(--brand-primary)",
                  }}
                >
                  <option value="Credit Card">Credit Card</option>
                  <option value="Debit Card">Debit Card</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-2"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Cardholder Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Name on card"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
                  style={{
                    borderColor: "var(--border-primary)",
                    color: "var(--text-primary)",
                    backgroundColor: "var(--bg-secondary)",
                    focusRing: "var(--brand-primary)",
                  }}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="cardNumber"
                  className="block text-sm font-medium mb-2"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Card Number
                </label>
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  placeholder="XXXX XXXX XXXX XXXX"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
                  style={{
                    borderColor: "var(--border-primary)",
                    color: "var(--text-primary)",
                    backgroundColor: "var(--bg-secondary)",
                    focusRing: "var(--brand-primary)",
                  }}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="expiry"
                    className="block text-sm font-medium mb-2"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    id="expiry"
                    name="expiry"
                    placeholder="MM/YY"
                    value={formData.expiry}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
                    style={{
                      borderColor: "var(--border-primary)",
                      color: "var(--text-primary)",
                      backgroundColor: "var(--bg-secondary)",
                      focusRing: "var(--brand-primary)",
                    }}
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="cvv"
                    className="block text-sm font-medium mb-2"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    CVV
                  </label>
                  <input
                    type="text"
                    id="cvv"
                    name="cvv"
                    placeholder="XXX"
                    value={formData.cvv}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
                    style={{
                      borderColor: "var(--border-primary)",
                      color: "var(--text-primary)",
                      backgroundColor: "var(--bg-secondary)",
                      focusRing: "var(--brand-primary)",
                    }}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isDefault"
                    checked={formData.isDefault}
                    onChange={handleChange}
                    className="w-4 h-4 accent-primary"
                    style={{ accentColor: "var(--brand-primary)" }}
                  />
                  <span
                    className="text-sm"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Set as default payment method
                  </span>
                </label>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsAddingCard(false);
                  setEditingCardId(null);
                }}
                className="px-4 py-2 rounded-md text-sm font-medium"
                style={{
                  color: "var(--text-primary)",
                  backgroundColor: "var(--bg-secondary)",
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-md text-sm font-medium"
                style={{
                  backgroundColor: "var(--brand-primary)",
                  color: "var(--text-on-brand)",
                }}
              >
                {editingCardId ? "Update Card" : "Add Card"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {paymentMethods.map((card) => (
            <div
              key={card.id}
              className={`border rounded-lg p-4 relative ${
                card.isDefault ? "ring-2" : ""
              }`}
              style={{
                borderColor: "var(--border-primary)",
                ringColor: card.isDefault ? "var(--brand-primary)" : undefined,
              }}
            >
              <div className="flex justify-between mb-2">
                <h3
                  className="font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  {card.type}
                </h3>
                {card.isDefault && (
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: "var(--bg-accent-light)",
                      color: "var(--brand-primary)",
                    }}
                  >
                    Default
                  </span>
                )}
              </div>

              <div className="flex gap-2 mb-2 items-start">
                <FiCreditCard
                  className="min-w-5 h-5 mt-0.5"
                  style={{ color: "var(--text-secondary)" }}
                />
                <div style={{ color: "var(--text-primary)" }}>
                  <p className="text-lg font-mono">{card.cardNumber}</p>
                  <p>{card.name}</p>
                  <p
                    className="text-sm mt-1"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Expires: {card.expiry}
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => handleEditCard(card)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <FiEdit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteCard(card.id)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  style={{ color: "var(--error-color)" }}
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaymentMethods;
