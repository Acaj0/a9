import "../globals.css";

import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import {
  VisualEditing,
  toPlainText,
  type PortableTextBlock,
} from "next-sanity";
import { Inter } from "next/font/google";
import { draftMode } from "next/headers";
import { Suspense } from "react";

import AlertBanner from "./alert-banner";
import PortableText from "./portable-text";

import * as demo from "@/sanity/lib/demo";
import { sanityFetch } from "@/sanity/lib/fetch";
import { settingsQuery } from "@/sanity/lib/queries";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";
import Image from "next/image";
import { AspectRatio } from "@/Components/ui/aspect-ratio";
import { Sheet, SheetContent, SheetTrigger } from "@/Components/ui/sheet";
import { Button } from "@/Components/ui/button";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await sanityFetch({
    query: settingsQuery,
    // Metadata should never contain stega
    stega: false,
  });
  const title = settings?.title || demo.title;
  const description = settings?.description || demo.description;

  const ogImage = resolveOpenGraphImage(settings?.ogImage);
  let metadataBase: URL | undefined = undefined;
  try {
    metadataBase = settings?.ogImage?.metadataBase
      ? new URL(settings.ogImage.metadataBase)
      : undefined;
  } catch {
    // ignore
  }
  return {
    metadataBase,
    title: {
      template: `%s | ${title}`,
      default: title,
    },
    description: toPlainText(description),
    openGraph: {
      images: ogImage ? [ogImage] : [],
    },
  };
}

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});
async function NavBar() {
  return (
    <div>
      <div className="bg-[#151618] h-12 flex md:hidden justify-between items-center p-2">
        <a href="/">
          <div className="w-[40px]">
            <AspectRatio ratio={4 / 4}>
              <Image
                src={"/a9.png"}
                fill
                alt="logo da banda"
                className="rounded-md object-cover"
              />
            </AspectRatio>
          </div>
        </a>
        <h1 className="italic text-xl text-white"></h1> <MobileNav />{" "}
      </div>

      <div className="hidden bg-[#151618] h-24 md:flex justify-between px-28 items-center gap-20 text-xl text-white">
        <div className="w-[90px]">
          <AspectRatio ratio={4 / 4}>
            <Image
              src={"/a9.png"}
              fill
              alt="logo da banda"
              className="rounded-md object-cover"
            />
          </AspectRatio>
        </div>
        <div className="hidden bg-[#151618] h-24 md:flex justify-between items-center ml-14 gap-20 text-xl text-white">
          <a
            className="transition ease-in-out delay-50 hover:-translate-y-1 hover:scale-110 duration-100 hover:text-gray-200"
            href="/"
          >
            Sobre Nós
          </a>
          <a
            className="transition ease-in-out delay-50 hover:-translate-y-1 hover:scale-110 duration-100 hover:text-gray-200"
            href="/"
          >
            Serviços
          </a>
          <a
            className="transition ease-in-out delay-50 hover:-translate-y-1 hover:scale-110 duration-100 hover:text-gray-200"
            href="/"
          >
            Contato
          </a>
        </div>
      </div>
    </div>
  );
}
const MobileNav = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" name="menu">
          <svg
            width="25"
            height="25"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.5 3C1.22386 3 1 3.22386 1 3.5C1 3.77614 1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1 7.5C1 7.22386 1.22386 7 1.5 7H13.5C13.7761 7 14 7.22386 14 7.5C14 7.77614 13.7761 8 13.5 8H1.5C1.22386 8 1 7.77614 1 7.5ZM1 11.5C1 11.2239 1.22386 11 1.5 11H13.5C13.7761 11 14 11.2239 14 11.5C14 11.7761 13.7761 12 13.5 12H1.5C1.22386 12 1 11.7761 1 11.5Z"
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
            ></path>
          </svg>
        </Button>
      </SheetTrigger>

      <SheetContent>
        <div className="mt-10 flex flex-col gap-6 text-base font-semibold">
          <a href="/">Inicio</a>
          <a href="/">Sobre Nós</a>
          <a href="/">Serviços</a>
          <a href="/">Contato</a>
        </div>
      </SheetContent>
    </Sheet>
  );
};

async function Footer() {
  const data = await sanityFetch({ query: settingsQuery });
  const footer = data?.footer || [];

  return (
    <footer className="bg-accent-1 border-accent-2 border-t">
      <div className="container mx-auto px-5">
        {footer.length > 0 ? (
          <PortableText
            className="prose-sm text-pretty bottom-0 w-full max-w-none bg-white py-12 text-center md:py-20"
            value={footer as PortableTextBlock[]}
          />
        ) : (
          <div className="flex flex-col items-center py-28 lg:flex-row">
            <h3 className="mb-10 text-center text-4xl font-bold leading-tight tracking-tighter lg:mb-0 lg:w-1/2 lg:pr-4 lg:text-left lg:text-5xl">
              Built with Next.js.
            </h3>
            <div className="flex flex-col items-center justify-center lg:w-1/2 lg:flex-row lg:pl-4">
              <a
                href="https://nextjs.org/docs"
                className="mx-3 mb-6 border border-black bg-black py-3 px-12 font-bold text-white transition-colors duration-200 hover:bg-white hover:text-black lg:mb-0 lg:px-8"
              >
                Read Documentation
              </a>
              <a
                href="https://github.com/vercel/next.js/tree/canary/examples/cms-sanity"
                className="mx-3 font-bold hover:underline"
              >
                View on GitHub
              </a>
            </div>
          </div>
        )}
      </div>
    </footer>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt" className={`${inter.variable} bg-white text-black`}>
      <NavBar></NavBar>
      <body>
        <section className="min-h-screen">
          {draftMode().isEnabled && <AlertBanner />}
          <main>{children}</main>
          <Suspense>
            <Footer />
          </Suspense>
        </section>
        {draftMode().isEnabled && <VisualEditing />}
        <SpeedInsights />
      </body>
    </html>
  );
}
