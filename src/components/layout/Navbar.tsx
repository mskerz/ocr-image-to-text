"use client";

import ThemeToggleButton from "../button/theme-toggle";

function Navbar() {
  return (
    <nav className="sticky top-0 bg-transparent p-2 py-3 backdrop-blur">
      <div className="flex items-center justify-around">
        <div>
          <span className="text-2xl font-bold ">Image to Text</span>
        </div>

        <div>
          <ul className="flex items-center gap-4">
            <li>
              <ThemeToggleButton />
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
