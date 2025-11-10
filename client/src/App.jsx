import { useState } from "react";

export default function App() {
  const [amount, setAmount] = useState("");
  const [result, setResult] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Fake CO2 estimate for static demo
    const fakeResult = (parseFloat(amount) * 50).toFixed(2);
    setResult(fakeResult);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 text-gray-900">
      <h1 className="text-3xl font-bold mb-6">🌱 GreenLink</h1>
      <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4">
        <input
          className="border p-2 rounded"
          type="number"
          step="0.01"
          placeholder="Enter electricity use (MWh)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Calculate CO₂
        </button>
      </form>
      {result && (
        <p className="mt-6 text-lg font-medium">
          Estimated Emission: {result} kg CO₂
        </p>
      )}
    </div>
  );
}
