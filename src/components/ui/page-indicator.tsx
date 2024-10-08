"use client";

import { useState, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageIndicatorProps {
  pages: string[];
  activePage: string;
  onPageChange: (page: string) => void;
}

function PageIndicator({
  pages,
  activePage,
  onPageChange,
}: PageIndicatorProps) {
  return (
    <nav className="w-full mb-4">
      <ul className="flex justify-between items-center border-b border-gray-200">
        {pages.map((page) => (
          <li key={page} className="flex-1">
            <button
              onClick={() => onPageChange(page)}
              className={cn(
                "w-full py-2 px-1 text-center text-md font-medium text-gray-500 hover:text-gray-700 focus:outline-none",
                activePage === page && "text-primary border-b-2 border-primary"
              )}
            >
              {page}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default PageIndicator;
