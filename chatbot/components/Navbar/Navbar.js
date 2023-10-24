import { faBars, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
export const Navbar = ({ toggleSidebar, title }) => {
  return (
    <>
      <nav className="sticky top-0 w-full bg-gray-800 shadow">
        <div className="px-4 md:flex md:items-center md:justify-between">
          <FontAwesomeIcon
            icon={faBars}
            onClick={toggleSidebar}
            className="cursor-pointer p-4 text-4xl text-white"
          />
          {title ? (
            <div
              className="w-80 overflow-hidden text-ellipsis whitespace-nowrap text-2xl text-white md:text-3xl"
              title={title}
            >
              {title}
            </div>
          ) : (
            ""
          )}
          <Link
            href="/chat"
            className="text-3xl text-white md:text-4xl"
            title="New Chat"
          >
            <FontAwesomeIcon icon={faPlus} />
          </Link>
        </div>
      </nav>
    </>
  );
};

/*
      <nav className="sticky top-0 w-full bg-gray-800 shadow">
        <div className="justify-between px-4 md:flex md:items-center md:px-4">
        */
