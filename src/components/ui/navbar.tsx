import Link from "next/link"
import { ModeToggle } from "./ModeToggle"
import { CodeIcon } from "lucide-react"
import { SignedIn, UserButton } from "@clerk/nextjs"
import DashboardBtn from "../DashboardBtn"

const Navbar = () => {
  return (
    <nav className="border-b">
      <div className="flex items-center h-16 px-4 container mx-auto">
        {/* left side logo */}
        <Link href="/" className="flex items-center gap-2 font-semibold text-2xl mr-6 font-mono hover:opacity-80 transition-opacity">
          <CodeIcon className="size-8 text-emerald-500" />
          <span className="bg-gradient-to-r from-emerald-600 to-teal-500 text-transparent bg-clip-text">
            CodeBuddy
          </span>
        </Link>

        {/* right side */}
        <SignedIn>
        <div className="flex items-center space-x-4 ml-auto">
          <DashboardBtn />
          <ModeToggle />
          <UserButton />
        </div>
        </SignedIn>
      </div>
    </nav>
  )
}

export default Navbar