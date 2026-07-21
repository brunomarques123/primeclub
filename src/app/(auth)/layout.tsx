import Image from "next/image";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(251,191,36,0.12),transparent_60%)]" />
      <div className="relative flex flex-col items-center mb-8">
        <Image src="/logo.png" alt="PrimeClub" width={72} height={72} className="rounded-2xl shadow-lg shadow-amber-500/10" />
      </div>
      <div className="relative w-full max-w-sm rounded-2xl border border-neutral-800 bg-neutral-900/80 backdrop-blur p-8 shadow-2xl">
        {children}
      </div>
    </div>
  );
}
