import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link, useLocation } from "react-router-dom";
import DropDown from "../ui/DropDown";
import { useMemo } from "react";
import classBoard from "../../assets/class.png";
import { Menu, X } from "lucide-react";

interface HeaderProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

export function Header({ isMobileMenuOpen, setIsMobileMenuOpen }: HeaderProps) {
  const isLoggedIn = false;
  const location = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const breadcrumbItems = useMemo(() => {
    const pathSegments = location.pathname.split("/").filter(Boolean);

    const items = [
      {
        label: "Home",
        path: "/",
        isCurrentPage: location.pathname === "/",
      },
    ];

    pathSegments.forEach((segment, index) => {
      const path = "/" + pathSegments.slice(0, index + 1).join("/");
      const isCurrentPage = path === location.pathname;

      const label = segment
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());

      items.push({
        label,
        path,
        isCurrentPage,
      });
    });

    return items;
  }, [location.pathname]);

  return (
    <>
      <div className="w-full h-12 sm:h-16 border-b border-neutral-800 bg-transparent flex items-center justify-between px-3 sm:px-4">
        <div className="flex items-center justify-start gap-3 sm:gap-6 min-w-0 flex-1">
          <div className="lg:hidden flex-shrink-0">
            <button
              onClick={toggleMobileMenu}
              className="p-1.5 text-neutral-400 hover:text-neutral-200 bg-neutral-900 border border-neutral-700 rounded-md"
            >
              {isMobileMenuOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </button>
          </div>

          <div className="flex-shrink-0">
            <img
              src={classBoard}
              alt="Logo"
              className="h-8 sm:h-11 rounded-xl bg-white"
            />
          </div>
          <div className="min-w-0 overflow-hidden">
            <Breadcrumb>
              <BreadcrumbList className="flex-wrap">
                {breadcrumbItems.map((item, index) => (
                  <div key={item.path} className="flex items-center">
                    <BreadcrumbItem>
                      {item.isCurrentPage ? (
                        <span className="text-neutral-400 text-xs sm:text-sm truncate max-w-24 sm:max-w-none">
                          {item.label}
                        </span>
                      ) : (
                        <BreadcrumbLink asChild>
                          <Link
                            to={item.path}
                            className="text-xs sm:text-sm truncate max-w-24 sm:max-w-none hover:text-neutral-200"
                          >
                            {item.label}
                          </Link>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    {index < breadcrumbItems.length - 1 && (
                      <BreadcrumbSeparator className="mx-1 sm:mx-2" />
                    )}
                  </div>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>
        <div className="flex items-center p-1 sm:p-2 text-neutral-400 flex-shrink-0">
          {!isLoggedIn && <DropDown />}
        </div>
      </div>
    </>
  );
}
