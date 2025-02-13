// delete-reservation/[id]/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Reservation {
  customer_id: number;
  table_id: number;
  restaurant_id: number;
  reservation_time: string;
  status: string;
}

export default function DeleteReservation({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        const response = await fetch(`http://44.217.10.51:8080/reservations/${params.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch reservation data");
        }
        const data: Reservation = await response.json();
        setReservation(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchReservation();
  }, [params.id]);

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://44.217.10.51:8080/reservations/${params.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete reservation");
      }

      alert("Reservation deleted successfully!");
      router.push("/read-reservation"); // Cambia la ruta según tu estructura
    } catch (error) {
      alert(error instanceof Error ? error.message : "Unknown error");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Delete Reservation</h2>
      {reservation && (
        <div>
          <p><strong>Customer ID:</strong> {reservation.customer_id}</p>
          <p><strong>Table ID:</strong> {reservation.table_id}</p>
          <p><strong>Restaurant ID:</strong> {reservation.restaurant_id}</p>
          <p><strong>Reservation Time:</strong> {reservation.reservation_time}</p>
          <p><strong>Status:</strong> {reservation.status}</p>
          <div className="mt-4">
            <button
              onClick={handleDelete}
              className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
            >
              Delete Reservation
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
