import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button"; // Adjust the import based on your button component

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center">
      <h1 className="text-6xl font-bold text-gray-800">404</h1>
      <h2 className="mt-4 text-2xl text-gray-600">Page Not Found</h2>
      <p className="mt-2 text-gray-500">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link href="/">
        <Button className="mt-6">Go Back Home</Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
