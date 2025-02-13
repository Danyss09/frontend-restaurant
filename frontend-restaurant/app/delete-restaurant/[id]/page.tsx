// delete-restaurant/[id]/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Restaurant {
  name: string;
  address: string;
  phone: string;
}

export default function DeleteRestaurant({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await fetch(`http://98.85.28.84:3000/restaurants/${params.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch restaurant data");
        }
        const data: Restaurant = await response.json();
        setRestaurant(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [params.id]);

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://50.16.183.227:3000/delete_restaurant/restaurants/${params.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete restaurant");
      }

      alert("Restaurant deleted successfully!");
      router.push("/read-restaurant");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Unknown error");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Delete Restaurant</h2>
      {restaurant && (
        <div>
          <p><strong>Name:</strong> {restaurant.name}</p>
          <p><strong>Address:</strong> {restaurant.address}</p>
          <p><strong>Phone:</strong> {restaurant.phone}</p>
          <div className="mt-4">
            <button
              onClick={handleDelete}
              className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
            >
              Delete Restaurant
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
