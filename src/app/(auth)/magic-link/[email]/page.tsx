import MagicLinkLogin from "./MagicLinkLogin"

export default function MagicLinkPage({
  params,
  searchParams,
}: {
  params: { email: string };
  searchParams: { signature?: string };
}) {
  return (
    <MagicLinkLogin
      email={params.email}
      signature={searchParams.signature}
    />
  );
}
