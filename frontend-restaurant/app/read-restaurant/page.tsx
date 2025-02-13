"use client"; // Necesario para manejar eventos en el frontend

import { useState, useEffect } from "react";

// Definir la interfaz para los datos de un restaurante
interface Restaurant {
  _id: string;
  name: string;
  address: string;
  phone: string;
}

export default function ReadRestaurants() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch de restaurantes al cargar el componente
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await fetch("http://98.85.28.84:3000/restaurants/");
        
        // Verificar el estado de la respuesta
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: Restaurant[] = await response.json();  // Especificar el tipo de datos esperado
        
        if (Array.isArray(data)) {
          setRestaurants(data);
        } else {
          setError("Unexpected data format");
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  if (loading) {
    return <div className="text-center p-6">Loading...</div>;
  }

  if (error) {
    return <div className="text-center p-6 text-red-500">{error}</div>;
  }

  const handleEdit = (id: string) => {
    // Lógica para editar restaurante (puedes agregar el formulario o navegar a una página de edición)
    alert(`Editing restaurant with ID: ${id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`http://50.16.183.227:3000/delete_restaurant/restaurants/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete restaurant with ID: ${id}`);
      }

      // Eliminar el restaurante de la lista local después de la eliminación exitosa
      setRestaurants((prevRestaurants) => prevRestaurants.filter((restaurant) => restaurant._id !== id));

      alert("Restaurant deleted successfully!");
    } catch (error) {
      alert(`Error deleting restaurant: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6">Restaurants</h1>
      
      <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-4 text-left">Name</th>
            <th className="p-4 text-left">Address</th>
            <th className="p-4 text-left">Phone</th>
            <th className="p-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {restaurants.map((restaurant) => (
            <tr key={restaurant._id} className="border-b">
              <td className="p-4">{restaurant.name}</td>
              <td className="p-4">{restaurant.address}</td>
              <td className="p-4">{restaurant.phone}</td>
              <td className="p-4 space-x-2">
                <button
                  onClick={() => handleEdit(restaurant._id)}
                  className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(restaurant._id)}
                  className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
