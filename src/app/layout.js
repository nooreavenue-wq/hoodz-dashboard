import localFont from "next/font/local";
import { DM_Sans, Montserrat } from "next/font/google";
import "./globals.css";
import Providers from "../lib/Providers";
import ReduxProviders from "@/redux/lib/ReduxProvider";

const generalSans = localFont({
  src: "../assets/fonts/GeneralSans-Variable.woff2",
  variable: "--font-general-sans",
  weight: "100 900",
  display: "swap",
  subsets: ["latin"],
});

const Mont_serrat = Montserrat({
  variable: "--font-montserrat",
  display: "swap",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
});

export const metadata = {
  title: {
    default: "The-Hoodz-application-Dashboard",
    template: "%s | The-Hoodz-application-Dashboard",
  },
  description: "The-Hoodz-application-Dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </head>

      <body
        className={`${generalSans.className} ${Mont_serrat.variable} box-border antialiased`}
      >
        <ReduxProviders>
          {" "}
          <Providers>{children}</Providers>
        </ReduxProviders>
      </body>
    </html>
  );
}
