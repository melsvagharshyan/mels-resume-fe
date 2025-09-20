'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { name: 'Front-end', href: '/frontend' },
    { name: 'Backend', href: '/backend' },
    { name: 'Full-stack', href: '/fullstack' },
    { name: 'Info', href: '/info' },
  ];

  return (
    <nav className="bg-gray-800 text-white px-6 py-4 flex items-center justify-between relative">
      {/* Logo */}
      <Link href="/" className="flex items-center">
        <img
          src="https://res.cloudinary.com/dxfqf6fgv/image/upload/v1746817593/script_oyyrxy.png"
          alt="Logo"
          className="h-10 w-auto"
        />
      </Link>

      {/* Desktop Menu */}
      <ul className="hidden md:flex space-x-6">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={`hover:text-cyan-400 transition-colors ${
                pathname === link.href ? 'text-cyan-400 font-semibold' : ''
              }`}
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>

      {/* Apply Button (Desktop) */}
      <div className="hidden md:block">
        <button
          onClick={() => router.push('/job-apply')}
          className="bg-cyan-400 cursor-pointer text-white px-4 py-2 rounded-lg font-semibold hover:bg-cyan-300 transition"
        >
          Apply
        </button>
      </div>

      {/* Mobile Hamburger */}
      <button className="md:hidden text-2xl" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-gray-900 text-white flex flex-col items-center space-y-4 py-6 md:hidden shadow-lg z-50">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`hover:text-cyan-400 transition-colors ${
                pathname === link.href ? 'text-cyan-400 font-semibold' : ''
              }`}
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <button
            onClick={() => {
              router.push('/job-apply');
              setIsOpen(false);
            }}
            className="bg-cyan-400 cursor-pointer text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-cyan-300 transition"
          >
            Apply
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
