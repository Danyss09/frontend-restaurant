"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa"; // Iconos para mejor UX

interface Customer {
  _id: string;
  name: string;
  address: string;
  phone: string;
}

export default function ReadCustomer() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch("http://54.84.180.78:5000/get_customers");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Customer[] = await response.json();
        setCustomers(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const handleEdit = (id: string) => {
    router.push(`/update-customer/${id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`http://54.84.180.78:5000/delete_customer/customers/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete customer`);
      }

      setCustomers((prevCustomers) =>
        prevCustomers.filter((customer) => customer._id !== id)
      );
      alert("Customer deleted successfully!");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Unknown error");
    }
  };

  const handleCreate = () => {
    router.push("/create-customer");
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
        <h1 className="text-3xl font-bold text-gray-800">Customer Manager</h1>
        <button
          onClick={handleCreate}
          className="flex items-center bg-green-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-green-600 transition"
        >
          <FaPlus className="mr-2" /> Add Customer
        </button>
      </div>

      <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
        {customers.map((customer) => (
          <div key={customer._id} className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800">{customer.name}</h2>
            <p className="text-gray-600">{customer.address}</p>
            <p className="text-gray-600">{customer.phone}</p>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => handleEdit(customer._id)}
                className="flex items-center bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition"
              >
                <FaEdit className="mr-1" /> Edit
              </button>
              <button
                onClick={() => handleDelete(customer._id)}
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
