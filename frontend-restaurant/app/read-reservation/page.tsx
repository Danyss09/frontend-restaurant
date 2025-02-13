"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa"; // Iconos para mejor UX

interface Reservation {
  id: number;
  customer_id: number;
  table_id: number;
  restaurant_id: number;
  reservation_time: string;
  status: string;
}

export default function ReadReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await fetch("http://44.217.10.51:8080/reservations/");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Reservation[] = await response.json();
        setReservations(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const handleEdit = (id: number) => {
    router.push(`/update-reservation/${id}`);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://44.217.10.51:8080/reservations/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete reservation`);
      }

      setReservations((prevReservations) =>
        prevReservations.filter((reservation) => reservation.id !== id)
      );
      alert("Reservation deleted successfully!");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Unknown error");
    }
  };

  const handleCreate = () => {
    router.push("/create-reservation");
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
        <h1 className="text-3xl font-bold text-gray-800">Reservation Manager</h1>
        <button
          onClick={handleCreate}
          className="flex items-center bg-green-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-green-600 transition"
        >
          <FaPlus className="mr-2" /> Add Reservation
        </button>
      </div>

      <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
        {reservations.map((reservation) => (
          <div key={reservation.id} className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800">Reservation #{reservation.id}</h2>
            <p className="text-gray-600"><strong>Customer ID:</strong> {reservation.customer_id}</p>
            <p className="text-gray-600"><strong>Table ID:</strong> {reservation.table_id}</p>
            <p className="text-gray-600"><strong>Restaurant ID:</strong> {reservation.restaurant_id}</p>
            <p className="text-gray-600"><strong>Time:</strong> {reservation.reservation_time}</p>
            <p className="text-gray-600"><strong>Status:</strong> {reservation.status}</p>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => handleEdit(reservation.id)}
                className="flex items-center bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition"
              >
                <FaEdit className="mr-1" /> Edit
              </button>
              <button
                onClick={() => handleDelete(reservation.id)}
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
