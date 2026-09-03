import SetPasswordForm from "./_components/SetPasswordForm";

export const metadata = {
  title: "Set New Password",
  description: "Admin set new password page",
};
export default function SetNewPasswordPage() {
  return (
    <section className="w-full">
      <SetPasswordForm />
    </section>
  );
}
