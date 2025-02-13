"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaSave } from "react-icons/fa";

interface Customer {
  FirstName: string;
  LastName: string;
  Email: string;
  PhoneNumber: string;
  Address: string;
}

export default function UpdateCustomer({ params }: { params: { customer_id: string } }) {
  const router = useRouter();
  const { customer_id } = params;

  const [customer, setCustomer] = useState<Customer>({
    FirstName: "",
    LastName: "",
    Email: "",
    PhoneNumber: "",
    Address: "",
  });

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Obtener datos del cliente
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await fetch(`http://18.204.107.109:5000/get_customer/${customer_id}`);
        if (!response.ok) throw new Error("Failed to fetch customer data");

        const data: Customer = await response.json();
        setCustomer(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [customer_id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customer.FirstName || !customer.LastName || !customer.Email || !customer.PhoneNumber || !customer.Address) {
      setError("All fields are required.");
      return;
    }

    setUpdating(true);
    setError(null);

    try {
      const response = await fetch(`http://18.204.107.109:5000/update_customer?customer_id=${customer_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customer),
      });

      if (!response.ok) throw new Error("Failed to update customer");

      alert("Customer updated successfully!");
      router.push("/read-customer");
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
      <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Edit Customer</h2>

      {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-5 text-gray-900">
        <div>
          <label className="block text-sm font-medium text-gray-900">First Name</label>
          <input
            type="text"
            name="FirstName"
            value={customer.FirstName}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-900">Last Name</label>
          <input
            type="text"
            name="LastName"
            value={customer.LastName}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-900">Email</label>
          <input
            type="email"
            name="Email"
            value={customer.Email}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-900">Phone Number</label>
          <input
            type="text"
            name="PhoneNumber"
            value={customer.PhoneNumber}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-900">Address</label>
          <input
            type="text"
            name="Address"
            value={customer.Address}
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
              <FaSave className="mr-2" /> Update Customer
            </>
          )}
        </button>
      </form>
    </div>
  );
}
