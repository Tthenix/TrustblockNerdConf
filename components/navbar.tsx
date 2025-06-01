"use client";

import * as React from "react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ConnectWalletButton } from "@/components/connect-wallet-button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center space-x-2 transition-opacity hover:opacity-80"
          >
            <span className="text-2xl font-bold text-skyblue">Trust<span className="text-neonpink">Block</span></span>
          </Link>

          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/campaigns" className={navigationMenuTriggerStyle()}>
                    Explorar
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/licitaciones" className={navigationMenuTriggerStyle()}>
                    Licitaciones
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Cómo Funciona</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <Link
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-skyblue/20 to-neonpink/80 p-6 no-underline outline-none focus:shadow-md"
                          href="/"
                        >
                          <div className="mt-4 mb-2 text-lg font-medium text-white">
                            <span className="text-2xl font-bold text-skyblue">Trust<span className="text-neonpink">Block</span></span>
                          </div>
                          <p className="text-sm leading-tight text-white/90">
                            Crowdfunding con identidad verificada en blockchain
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/how-it-works/verification"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">
                            Verificación
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Cómo funciona la verificación de identidad en
                            blockchain
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/how-it-works/transparency"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">
                            Transparencia
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Seguimiento de fondos en tiempo real con blockchain
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/how-it-works/rewards"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">
                            Recompensas
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            NFTs y beneficios para donantes
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/about" className={navigationMenuTriggerStyle()}>
                    Acerca de
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4">
            <ConnectWalletButton />
            <Button asChild className="bg-neonpink hover:bg-neonpink/80 transition-colors">
              <Link href="/campaigns/create">
                Crear Campaña
              </Link>
            </Button>
          </div>

          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="outline" size="icon" className="border-none">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="border-l border-border/40 backdrop-blur-md bg-background/95"
            >
              <div className="grid gap-6 py-6">
                <Link
                  href="/"
                  className="flex items-center space-x-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="text-2xl font-bold text-skyblue">Trust<span className="text-neonpink">Block</span></span>
                </Link>
                <div className="grid gap-4">
                  <Link
                    href="/campaigns"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-sm font-medium transition-colors hover:text-primary"
                  >
                    Explorar
                  </Link>
                  <Link
                    href="/licitaciones"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-sm font-medium transition-colors hover:text-primary"
                  >
                    Licitaciones
                  </Link>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      Cómo Funciona
                    </p>
                    <Link
                      href="/how-it-works/verification"
                      onClick={() => setIsMenuOpen(false)}
                      className="text-sm transition-colors hover:text-primary block pl-4"
                    >
                      Verificación
                    </Link>
                    <Link
                      href="/how-it-works/transparency"
                      onClick={() => setIsMenuOpen(false)}
                      className="text-sm transition-colors hover:text-primary block pl-4"
                    >
                      Transparencia
                    </Link>
                    <Link
                      href="/how-it-works/rewards"
                      onClick={() => setIsMenuOpen(false)}
                      className="text-sm transition-colors hover:text-primary block pl-4"
                    >
                      Recompensas
                    </Link>
                  </div>
                  <Link
                    href="/about"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-sm font-medium transition-colors hover:text-primary"
                  >
                    Acerca de
                  </Link>
                </div>
                <div className="grid gap-2">
                  <ConnectWalletButton />
                  <Button asChild className="w-full bg-neonpink hover:bg-neonpink/80 transition-colors">
                    <Link
                      href="/campaigns/create"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Crear Campaña
                    </Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
