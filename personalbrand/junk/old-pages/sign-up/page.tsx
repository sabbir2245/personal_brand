import { SignUp } from "@clerk/nextjs";

export const metadata = { title: "Sign up" };

export default function SignUpPage() {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <SignUp />
    </div>
  );
}