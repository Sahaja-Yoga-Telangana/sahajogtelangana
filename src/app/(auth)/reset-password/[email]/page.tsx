import ResetPassword from "./ResetPassword";

export default function ResetPasswordPage({
  params,
  searchParams,
}: {
  params: { email: string };
  searchParams: { signature?: string };
}) {
  return (
    <ResetPassword
      email={params.email}
      signature={searchParams.signature}
    />
  );
}
