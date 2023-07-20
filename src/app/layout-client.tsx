"use client"

import Link from "next/link";
import { useState } from "react";

export default function RootLayoutClient() {
  const [menus, setMenus] = useState([
    { name: '/test/geo-fence', href: '/test/geo-fence' },
    { name: '/test/heat-map', href: '/test/heat-map' },
    { name: '/test/marker-icon-and-label', href: '/test/marker-icon-and-label' },
    { name: '/test/multiple-polygon', href: '/test/multiple-polygon' },
    { name: '/test/point-circle', href: '/test/point-circle' },
    { name: '/test/polygon-with-circle', href: '/test/polygon-with-circle' },
  ]);

  return (
    <>
      <ul className="w-full relative flex flex-wrap gap-2">
        {
          menus.map(menu => {
            return (
              <li 
                className="inline-flex relative"
                key={menu.name}>
                <Link 
                  href={menu.href}
                  className="w-full inline-flex px-6 py-2 text-sm text-slate-700 border border-slate-400 rounded-md cursor-pointer hover:bg-slate-200">
                  { menu.name }
                </Link>
              </li>
            );
          })
        }
      </ul>
    </>
  );
}
