'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Logo() {
  const pathname = usePathname();
  return (
    <span className="text-md md:text-lg whitespace-nowrap font-bold">
      {pathname === '/' ? (
        <span className="cursor-default pr-2">하조은의 글간</span>
      ) : (
        <Link
          href="/"
          className="hover:bg-gray-200 dark:hover:bg-[#313131] active:bg-gray-300 dark:active:bg-[#242424] p-2 rounded-sm -ml-2 transition-[background-color]"
        >
          하조은의 글간
        </Link>
      )}
    </span>
  );
}
