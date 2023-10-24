import { faBars, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
export const Navbar = ({ toggleSidebar }) => {
  return (
    <>
      <nav className="sticky top-0 w-full bg-gray-800 shadow">
      <div className="justify-between px-4 md:items-center md:flex md:px-4">
        <FontAwesomeIcon
          icon={faBars}
          onClick={toggleSidebar}
          className="cursor-pointer p-4 text-4xl text-white"
        />
        <Link
        href="/chat"
        className="side-menu-item  bg-emerald-500 hover:bg-emerald-600"
      >
        <FontAwesomeIcon icon={faPlus} />
        New Chat
      </Link>
        </div>
      </nav>
    </>
  );
};
