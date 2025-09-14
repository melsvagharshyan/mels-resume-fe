'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const links = [
    { name: 'Front-end', href: '/frontend' },
    { name: 'Backend', href: '/backend' },
    { name: 'Full-stack', href: '/fullstack' },
    { name: 'Info', href: '/info' },
  ];

  return (
    <nav className="bg-gray-800 text-white px-6 py-4 flex items-center justify-between">
      <ul className="flex space-x-6">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={`hover:text-yellow-400 transition-colors ${
                pathname === link.href ? 'text-yellow-400 font-semibold' : ''
              }`}
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>

      <button
        onClick={() => router.push('/job-apply')}
        className="bg-yellow-400 cursor-pointer text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition"
      >
        Apply
      </button>
    </nav>
  );
};

export default Navbar;
