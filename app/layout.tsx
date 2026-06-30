import type { Metadata } from "next";
import { DM_Sans, Inter  , Playfair_Display} from "next/font/google";

import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ohm | AI Quiz Generator",
  description: "A live AI quiz generator for school exhibitions.",
}

const dmSansHeading = DM_Sans({subsets:['latin'],variable:'--font-heading'});
 const playfairDisplay = Playfair_Display({subsets:['latin'],variable:'--font-display'});
const inter = Inter({subsets:['latin'],variable:'--font-sans'})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", "font-sans", inter.variable, dmSansHeading.variable , playfairDisplay.variable)}
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
