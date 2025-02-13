"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa"; // Iconos para mejor UX

interface Restaurant {
  _id: string;
  name: string;
  address: string;
  phone: string;
}

export default function ReadRestaurant() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await fetch("http://98.85.28.84:3000/restaurants");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Restaurant[] = await response.json();
        setRestaurants(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const handleEdit = (id: string) => {
    router.push(`/update-restaurant/${id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`http://50.16.183.227:3000/delete_restaurant/restaurants/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete restaurant`);
      }

      setRestaurants((prevRestaurants) =>
        prevRestaurants.filter((restaurant) => restaurant._id !== id)
      );
      alert("Restaurant deleted successfully!");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Unknown error");
    }
  };

  const handleCreate = () => {
    router.push("/create-restaurant");
  };

  if (loading) {
    return <div className="text-center p-6 text-gray-700">Loading...</div>;
  }

  if (error) {
    return <div className="text-center p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto mt-10 p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Restaurant Manager</h1>
        <button
          onClick={handleCreate}
          className="flex items-center bg-green-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-green-600 transition"
        >
          <FaPlus className="mr-2" /> Add Restaurant
        </button>
      </div>

      <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
        {restaurants.map((restaurant) => (
          <div key={restaurant._id} className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800">{restaurant.name}</h2>
            <p className="text-gray-600">{restaurant.address}</p>
            <p className="text-gray-600">{restaurant.phone}</p>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => handleEdit(restaurant._id)}
                className="flex items-center bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition"
              >
                <FaEdit className="mr-1" /> Edit
              </button>
              <button
                onClick={() => handleDelete(restaurant._id)}
                className="flex items-center bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition"
              >
                <FaTrash className="mr-1" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
