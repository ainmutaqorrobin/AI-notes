import { ThemeProvider } from "next-themes";
import { Navbar } from "./navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="page-shell">
        <Navbar />
        <main className="page-container py-6 sm:py-8">{children}</main>
      </div>
    </ThemeProvider>
  );
}
