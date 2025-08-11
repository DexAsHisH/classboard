import { Link } from "react-router-dom";

interface NavBarProps {
  isMobileMenuOpen: boolean;
  closeMobileMenu: () => void;
}

export const NavBar = ({ isMobileMenuOpen, closeMobileMenu }: NavBarProps) => {
  return (
    <>
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeMobileMenu}
        />
      )}

      <div
        className={`
        fixed lg:static
        top-0 left-0
        w-64 lg:w-40
        h-full lg:h-auto
        bg-neutral-950 lg:bg-transparent
        border-r border-neutral-800
        p-4
        overflow-auto
        transform lg:transform-none
        transition-transform duration-300 ease-in-out
        z-40 lg:z-auto
        ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }
      `}
      >
        <div className="lg:hidden h-16 mb-4" />

        <nav className="flex flex-col space-y-3 sm:space-y-4">
          <Link
            to="/dashboard"
            onClick={closeMobileMenu}
            className="text-base sm:text-lg font-semibold text-neutral-400 hover:text-background transition-colors duration-200 py-2 lg:py-0 px-2 lg:px-0 rounded-md lg:rounded-none hover:bg-neutral-800 lg:hover:bg-transparent"
          >
            Dashboard
          </Link>
          <Link
            to="/courses"
            onClick={closeMobileMenu}
            className="text-base sm:text-lg font-semibold text-neutral-400 hover:text-background transition-colors duration-200 py-2 lg:py-0 px-2 lg:px-0 rounded-md lg:rounded-none hover:bg-neutral-800 lg:hover:bg-transparent"
          >
            Courses
          </Link>
          <Link
            to="/assignments"
            onClick={closeMobileMenu}
            className="text-base sm:text-lg font-semibold text-neutral-400 hover:text-background transition-colors duration-200 py-2 lg:py-0 px-2 lg:px-0 rounded-md lg:rounded-none hover:bg-neutral-800 lg:hover:bg-transparent"
          >
            Assignments
          </Link>
          <Link
            to="/cgpa"
            onClick={closeMobileMenu}
            className="text-base sm:text-lg font-semibold text-neutral-400 hover:text-background transition-colors duration-200 py-2 lg:py-0 px-2 lg:px-0 rounded-md lg:rounded-none hover:bg-neutral-800 lg:hover:bg-transparent"
          >
            CGPA
          </Link>
        </nav>
      </div>
    </>
  );
};
