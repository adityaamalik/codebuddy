import { SignInButton } from "@clerk/nextjs";
import { SignUpButton } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";
import { SignedIn } from "@clerk/nextjs";
import { SignedOut } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="m-10">
      <SignedOut>
              <SignInButton />
              <SignUpButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
    </div>
  );
}
