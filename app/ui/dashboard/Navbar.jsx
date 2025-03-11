import Link from "next/link";
import NavbarLinks from "@/app/ui/dashboard/NavbarLinks";
import SportSphereLogo from "@/app/ui/sportsphere-logo";
import Signout from "@/app/ui/dashboard/Signout";

export default function Navbar(){
    return (
      <div className="flex h-full flex-col px-3 py-4 md:px-2">
        <Link
          className="mb-2 flex h-20 items-end justify-start rounded-md bg-blue-600 p-4 md:h-40"
          href="/"
        >
          <div className="w-32 text-white md:w-40">
            <SportSphereLogo />
          </div>
        </Link>
        <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
          <NavbarLinks />
          <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
          <Signout />
        </div>
      </div>
    );
}