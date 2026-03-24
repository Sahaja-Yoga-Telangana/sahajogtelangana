import SignInOne from "./SignInOne";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return <SignInOne error={searchParams.error} />;
}
