import NextLink from "next/link";
// import { Logo } from "@/components/icons";

interface NavbarProps {
  title: string;
  btn: string;
}

export const Navbar: React.FC<NavbarProps> = ({title, btn}) => {
  return (
    <nav className="bg-white shadow-lg px-4 py-2 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex-shrink-0">
          {/* <NextLink href="/admin-pannel"> */}
            {/* <p className="flex items-center space-x-1"> */}
              {/* <Logo /> */}
              <p className="font-bold text-gray-800">{title}</p>
            {/* </p> */}
          {/* </NextLink> */}
        </div>

        <div className="hidden sm:flex sm:space-x-4">

          <NextLink href="/add-new-album">
            <p className="text-sm font-normal text-gray-600 bg-gray-100 px-3 py-1 rounded-md hover:bg-gray-200">
              {btn}
            </p>
          </NextLink>

          <button className="text-sm font-normal text-gray-600 bg-gray-100 px-3 py-1 rounded-md hover:bg-gray-200">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};
