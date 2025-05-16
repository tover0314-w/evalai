'use client';

import React from 'react';
import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="text-xl font-semibold text-gray-800">
            AI评估平台
          </Link>
          <div className="flex space-x-8">
            <Link href="/evaluate" className="text-gray-600 hover:text-gray-900">
              评估中心
            </Link>
            <Link href="/dataset" className="text-gray-600 hover:text-gray-900">
              数据集生成
            </Link>
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
              评估记录
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 