"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaSave } from "react-icons/fa"; // Icono para el botón

interface Reservation {
  customer_id: number;
  table_id: number;
  restaurant_id: number;
  reservation_time: string;
  status: string;
}

export default function UpdateReservation({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;

  const [reservation, setReservation] = useState<Reservation>({
    customer_id: 0,
    table_id: 0,
    restaurant_id: 0,
    reservation_time: "",
    status: "Pending",
  });

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Obtener los datos de la reservación al cargar el componente
  useEffect(() => {
    const fetchReservation = async () => {
      try {
        const response = await fetch(`http://44.217.10.51:8080/reservations/${id}`);
        if (!response.ok) throw new Error("Failed to fetch reservation data");

        const data: Reservation = await response.json();
        setReservation(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchReservation();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setReservation({ ...reservation, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación antes de enviar
    if (!reservation.customer_id || !reservation.table_id || !reservation.restaurant_id || !reservation.reservation_time) {
      setError("All fields are required.");
      return;
    }

    setUpdating(true);
    setError(null);

    try {
      const response = await fetch(`http://44.217.10.51:8080/reservations/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reservation),
      });

      if (!response.ok) throw new Error("Failed to update reservation");

      alert("Reservation updated successfully!");
      router.push("/read-reservation");
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
      <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Edit Reservation</h2>

      {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-5 text-gray-900">
        <div>
          <label className="block text-sm font-medium text-gray-900">Customer ID</label>
          <input
            type="number"
            name="customer_id"
            value={reservation.customer_id}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-900">Table ID</label>
          <input
            type="number"
            name="table_id"
            value={reservation.table_id}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-900">Restaurant ID</label>
          <input
            type="number"
            name="restaurant_id"
            value={reservation.restaurant_id}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-900">Reservation Time</label>
          <input
            type="datetime-local"
            name="reservation_time"
            value={reservation.reservation_time}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-900">Status</label>
          <select
            name="status"
            value={reservation.status}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            required
          >
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center bg-blue-600 text-white font-bold p-3 rounded-lg hover:bg-blue-700 transition duration-300"
          disabled={updating}
        >
          {updating ? "Updating..." : (
            <>
              <FaSave className="mr-2" /> Update Reservation
            </>
          )}
        </button>
      </form>
    </div>
  );
}
