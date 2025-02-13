"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaPlus } from "react-icons/fa"; // Icono para el botón

export default function CreateRestaurant() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false); // Estado de carga
  const [error, setError] = useState<string | null>(null); // Manejo de errores
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones básicas antes de enviar
    if (!name || !address || !phone) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://3.226.63.93:3000/restaurants/create_restaurant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, address, phone }),
      });

      if (response.ok) {
        alert("Restaurant created successfully!");
        setName("");
        setAddress("");
        setPhone("");
        router.push("/read-restaurant"); // Redirigir a la lista de restaurantes
      } else {
        throw new Error("Failed to create restaurant.");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-8 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Create Restaurant</h1>

      {/* Mostrar mensaje de error si existe */}
      {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          type="text"
          placeholder="Restaurant Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <button
          type="submit"
          className="w-full flex items-center justify-center bg-blue-600 text-white font-bold p-3 rounded-lg hover:bg-blue-700 transition duration-300"
          disabled={loading}
        >
          {loading ? "Creating..." : (
            <>
              <FaPlus className="mr-2" /> Add Restaurant
            </>
          )}
        </button>
      </form>
    </div>
  );
}
