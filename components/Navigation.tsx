'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: '首页', order: 1 },
    { href: '/benchmark', label: 'Benchmark 构建', order: 2 },
    { href: '/dataset', label: '数据集生成', order: 3 },
    { href: '/evaluate', label: 'AI产品评估', order: 4 },
    { href: '/report', label: '评估报告', order: 5 },
  ];

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center h-16" style={{ minWidth: '600px' }}>
          <div className="flex items-center space-x-8 flex-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  order: link.order,
                  flex: '0 0 auto'
                }}
                className={`inline-flex items-center px-4 pt-1 border-b-2 text-sm font-medium whitespace-nowrap ${
                  pathname === link.href
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
} 