"use client";

import {
  ChevronDown,
  ChevronUp,
  ContactRound,
  Home,
  ListMinusIcon,
  ListTodo,
  LogOut,
  Users,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

function Sidebar() {
  const pathname = usePathname();

  const session = useSession();

  const nav = pathname.split("/");

  const [isExpanded, setIsExpanded] = useState(false);

  const activePath =
    "bg-gray-50 text-gray-800 border-l-4  border-l-indigo-500 ";
  const inactivePath =
    " hover:bg-gray-50 hover:text-gray-800 border-transparent hover:border-indigo-500";

  function handleLogout() {
    signOut();
  }

  return (
    <div className="fixed min-h-screen flex flex-col top-0 left-0 w-64 bg-white h-full border-r z-50">
      <div className="flex items-center justify-center h-14 ">
        <div className="w-full flex gap-4  pt-8  items-center">
          <img className="w-full rounded-lg " src="/digimax.jpeg" alt="" />
          {/* <span className="font-semibold">Anvitech</span> */}
        </div>
      </div>
      <div className="overflow-y-auto overflow-x-hidden flex-grow mt-8">
        <ul className="flex flex-col py-4 space-y-1">
          {/* <li className="px-5">
            <div className="flex flex-row items-center h-8">
              <div className="text-sm font-light tracking-wide text-gray-500">
                Inicio
              </div>
            </div>
          </li> */}
          <li>
            <Link
              href={"/system"}
              className={`relative flex flex-row items-center h-11 focus:outline-none  text-gray-600  border-l-4   pr-6 ${
                pathname === "/system" ? activePath : inactivePath
              } transition-all`}
            >
              <span className="inline-flex justify-center items-center ml-4">
                <Home size={20} />
              </span>
              <span className="ml-2 text-sm tracking-wide truncate">
                Inicio
              </span>
            </Link>
          </li>
          {/* ---------------------------- */}
          <li>
            <Link
              onClick={() => setIsExpanded(!isExpanded)}
              href={"#"}
              className={`relative flex flex-row items-center h-11 focus:outline-none  text-gray-600  border-l-4   pr-6 ${
                pathname.includes("/system/reportes")
                  ? activePath
                  : inactivePath
              } transition-all`}
            >
              <span className="inline-flex justify-center items-center ml-4">
                <ListTodo size={20} />
              </span>
              <span className="ml-2 text-sm tracking-wide truncate w-full flex justify-between">
                Reportes{" "}
                {isExpanded ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </span>
            </Link>

            {isExpanded && (
              <ul className="ml-10 mt-2">
                <li>
                  <Link
                    href={"/system/reportes/diario"}
                    className={`relative flex flex-row items-center h-9 focus:outline-none  pr-6 ${
                      pathname === "/system/reportes/diario"
                        ? activePath
                        : inactivePath
                    } transition-all`}
                  >
                    <span className="ml-2 text-sm tracking-wide truncate">
                      Reporte diario
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    href={"/system/reportes/semanal"}
                    className={`relative flex flex-row items-center h-9 focus:outline-none  pr-6 ${
                      pathname === "/system/reportes/semanal"
                        ? activePath
                        : inactivePath
                    } transition-all`}
                  >
                    <span className="ml-2 text-sm tracking-wide truncate">
                      Reporte Semanal
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    href={"/system/reportes/exportar"}
                    className={`relative flex flex-row items-center h-9 focus:outline-none  pr-6 ${
                      pathname === "/system/reportes/exportar"
                        ? activePath
                        : inactivePath
                    } transition-all`}
                  >
                    <span className="ml-2 text-sm tracking-wide truncate">
                      Exportar datos
                    </span>
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {session.data?.user.role === "admin" && (
            <li className="transition-all">
              <Link
                href={"/system/usuarios"}
                className={`relative flex flex-row items-center h-11 focus:outline-none  text-gray-600  border-l-4   pr-6 ${
                  pathname === "/system/notifications"
                    ? activePath
                    : inactivePath
                } transition-all`}
              >
                <span className="inline-flex justify-center items-center ml-4">
                  <Users size={20} />
                </span>
                <span className="ml-2 text-sm tracking-wide truncate">
                  Usuarios
                </span>
              </Link>
            </li>
          )}

          <li>
            <Link
              href={"/system/trabajadores"}
              className={`relative flex flex-row items-center h-11 focus:outline-none  text-gray-600  border-l-4   pr-6 ${
                pathname === "/system/trabajadores" ? activePath : inactivePath
              } transition-all`}
            >
              <span className="inline-flex justify-center items-center ml-4">
                <ContactRound size={20} />
              </span>
              <span className="ml-2 text-sm tracking-wide truncate">
                Trabajadores
              </span>
            </Link>
          </li>

          <li>
            <Link
              href={"/system/incidencias"}
              className={`relative flex flex-row items-center h-11 focus:outline-none  text-gray-600  border-l-4   pr-6 ${
                pathname === "/system/incidencias" ? activePath : inactivePath
              } transition-all`}
            >
              <span className="inline-flex justify-center items-center ml-4">
                <ListMinusIcon size={20} />
              </span>
              <span className="ml-2 text-sm tracking-wide truncate">
                Incidencias
              </span>
            </Link>
          </li>

          <li role="button" onClick={handleLogout}>
            <div
              className={`relative flex flex-row items-center h-11 focus:outline-none  text-gray-600  border-l-4   pr-6 ${
                pathname === "/system/notifications" ? activePath : inactivePath
              } transition-all`}
            >
              <span className="inline-flex justify-center items-center ml-4">
                <LogOut size={20} />
              </span>
              <span className="ml-2 text-sm tracking-wide truncate">Salir</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
