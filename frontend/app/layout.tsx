export const metadata = {
  title: 'NovaMind AI',
  description: 'Premium AI Chatbot SaaS Platform'
};

import "../src/styles/globals.css";
import { AppProviders } from "../src/components/providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
