"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaSave } from "react-icons/fa"; // Icono para el botón

interface Restaurant {
  name: string;
  address: string;
  phone: string;
}

export default function UpdateRestaurant({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  
  const [restaurant, setRestaurant] = useState<Restaurant>({
    name: "",
    address: "",
    phone: "",
  });

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false); // Estado para mostrar la carga en la actualización
  const [error, setError] = useState<string | null>(null);

  // Obtener datos del restaurante al cargar el componente
  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await fetch(`http://98.85.28.84:3000/restaurants/${id}`);
        if (!response.ok) throw new Error("Failed to fetch restaurant data");

        const data: Restaurant = await response.json();
        setRestaurant(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRestaurant({ ...restaurant, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación antes de enviar
    if (!restaurant.name || !restaurant.address || !restaurant.phone) {
      setError("All fields are required.");
      return;
    }

    setUpdating(true);
    setError(null);

    try {
      const response = await fetch(`http://52.5.96.11:3000/update_restaurant/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(restaurant),
      });

      if (!response.ok) throw new Error("Failed to update restaurant");

      alert("Restaurant updated successfully!");
      router.push("/read-restaurant");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="text-center p-6 text-gray-900">Loading...</div>;
  if (error) return <div className="text-center text-red-500 p-6">{error}</div>;

  return (
    <div className="max-w-lg mx-auto mt-10 p-8 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Edit Restaurant</h2>

      {/* Mostrar mensaje de error si existe */}
      {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-5 text-gray-900">
        <div>
          <label className="block text-sm font-medium text-gray-900">Name</label>
          <input
            type="text"
            name="name"
            value={restaurant.name}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-900">Address</label>
          <input
            type="text"
            name="address"
            value={restaurant.address}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-900">Phone</label>
          <input
            type="text"
            name="phone"
            value={restaurant.phone}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center bg-blue-600 text-white font-bold p-3 rounded-lg hover:bg-blue-700 transition duration-300"
          disabled={updating}
        >
          {updating ? "Updating..." : (
            <>
              <FaSave className="mr-2" /> Update Restaurant
            </>
          )}
        </button>
      </form>
    </div>
  );
}
