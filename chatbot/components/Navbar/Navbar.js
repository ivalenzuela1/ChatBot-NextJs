import { faBars, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
export const Navbar = ({ toggleSidebar, title, setOpen }) => {
  return (
    <>
      <nav className="sticky top-0 w-full bg-gray-800 shadow">
        <div className="flex items-center justify-between px-4">
          <FontAwesomeIcon
            icon={faBars}
            onClick={toggleSidebar}
            className="cursor-pointer p-4 text-4xl text-white"
          />
          {title ? (
            <div
              className="text-1xl w-48 overflow-hidden text-ellipsis whitespace-nowrap text-white md:text-3xl"
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
            <FontAwesomeIcon icon={faPlus} onClick={() => setOpen(false)} />
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
