// components/layout/navbar/index.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Search,
  Menu,
  X,
  Film,
  Tv,
  Star,
  List,
  Bell,
  ChevronRight,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/stores/auth.store";
import { useLogout } from "@/hooks/api/use-auth";
import { Container } from "../static-class";
import { getAvatarUrl } from "@/hooks/api/use-user";

import { Skeleton } from "@/components/ui/skeleton";

const NavLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} passHref>
      <motion.span
        className={`relative px-3 py-2 text-sm font-medium transition-colors hover:text-primary
          ${isActive ? "text-primary" : "text-muted-foreground"}`}
        whileHover={{ scale: 1.05 }}
      >
        {children}
        {isActive && (
          <motion.div
            layoutId="activeNav"
            className="absolute -bottom-px left-0 right-0 h-0.5 bg-primary"
            initial={false}
          />
        )}
      </motion.span>
    </Link>
  );
};

const AppBar = () => {
  const [mounted, setMounted] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const user = useAuthStore((state) => state.fullUser);
  const { mutate: logoutUser, isPending: isUpdatingState } = useLogout();

  useEffect(() => {
    setMounted(true);
  }, []);
  // During SSR and initial hydration, render a placeholder
  if (!mounted) {
    return (
      <nav className={Container}>
        <div className="flex h-14 items-center px-4">
          <div className="flex items-center space-x-2">
            <Film className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block">MovieBase</span>
          </div>
          <div className="grid gap-3 p-4 w-[400px] grid-cols-2">
            <Skeleton className="block p-3 rounded-md" />
            <Skeleton className="block p-3 rounded-md" />
          </div>
        </div>
      </nav>
    ); // Adjust height as needed
  }
  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className={Container}>
        <div className="flex h-14 items-center px-4">
          <Link href="/" className="flex items-center space-x-2">
            <Film className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block">MovieBase</span>
          </Link>

          <NavigationMenu className="mx-6 hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Movies</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-4 w-[400px] grid-cols-2">
                    <NavigationMenuLink
                      href="/movies/popular"
                      className="block p-3 hover:bg-muted rounded-md"
                    >
                      <div className="font-medium mb-1">Popular</div>
                      <p className="text-sm text-muted-foreground">
                        Top trending movies this week
                      </p>
                    </NavigationMenuLink>
                    <NavigationMenuLink
                      href="/movies/now-playing"
                      className="block p-3 hover:bg-muted rounded-md"
                    >
                      <div className="font-medium mb-1">Now Playing</div>
                      <p className="text-sm text-muted-foreground">
                        Currently in theaters
                      </p>
                    </NavigationMenuLink>
                    <NavigationMenuLink
                      href="/movies/upcoming"
                      className="block p-3 hover:bg-muted rounded-md"
                    >
                      <div className="font-medium mb-1">Upcoming</div>
                      <p className="text-sm text-muted-foreground">
                        Soon to be released
                      </p>
                    </NavigationMenuLink>
                    <NavigationMenuLink
                      href="/movies/top-rated"
                      className="block p-3 hover:bg-muted rounded-md"
                    >
                      <div className="font-medium mb-1">Top Rated</div>
                      <p className="text-sm text-muted-foreground">
                        Highest rated of all time
                      </p>
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger>TV Shows</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-4 w-[400px] grid-cols-2">
                    <NavigationMenuLink
                      href="/tv/popular"
                      className="block p-3 hover:bg-muted rounded-md"
                    >
                      <div className="font-medium mb-1">Popular</div>
                      <p className="text-sm text-muted-foreground">
                        Trending TV shows
                      </p>
                    </NavigationMenuLink>
                    <NavigationMenuLink
                      href="/tv/airing-today"
                      className="block p-3 hover:bg-muted rounded-md"
                    >
                      <div className="font-medium mb-1">Airing Today</div>
                      <p className="text-sm text-muted-foreground">
                        New episodes today
                      </p>
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavLink href="/people">People</NavLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex items-center ml-auto space-x-4">
            <motion.div
              animate={{ width: isSearchOpen ? "300px" : "40px" }}
              className="relative"
            >
              {isSearchOpen ? (
                <Input
                  type="search"
                  placeholder="Search movies, TV shows, people..."
                  className="w-full pr-8"
                  autoFocus
                  onBlur={() => setIsSearchOpen(false)}
                />
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSearchOpen(true)}
                >
                  <Search className="h-5 w-5" />
                </Button>
              )}
            </motion.div>

            {user ? (
              <>
                <Button variant="ghost" size="icon">
                  <Bell className="h-5 w-5" />
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-8 w-8 rounded-full"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={
                            getAvatarUrl(user.avatar) ||
                            user.avatar ||
                            undefined
                          }
                          alt={user.name}
                        />
                        <AvatarFallback>{user.name?.[0]}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user.name}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <List className="mr-2 h-4 w-4" />
                      <span>My Lists</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Star className="mr-2 h-4 w-4" />
                      <span>Ratings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Film className="mr-2 h-4 w-4" />
                      <span>Watchlist</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <Link href="/profile">
                      <DropdownMenuItem>Profile</DropdownMenuItem>
                    </Link>
                    <Link href="/settings">
                      <DropdownMenuItem>Settings</DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <span onClick={() => logoutUser()}>Sign out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <a href="/auth/signin">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </a>
                <a href="/auth/signup">
                  <Button size="sm">Sign Up</Button>
                </a>
              </div>
            )}

            <MobileMenu />
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default AppBar;

const MobileNavItem = ({
  href,
  icon: Icon,
  children,
}: {
  href: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href}>
      <div
        className={`flex items-center justify-between p-3 rounded-md
        ${isActive ? "bg-primary/10 text-primary" : "hover:bg-muted"}`}
      >
        <div className="flex items-center gap-3">
          <Icon className="h-5 w-5" />
          <span className="font-medium">{children}</span>
        </div>
        <ChevronRight className="h-4 w-4" />
      </div>
    </Link>
  );
};

const MobileMenu = () => {
  const user = useAuthStore((state) => state.fullUser);

  console.log({ user });
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:w-80 p-0">
        <SheetHeader className="p-4 border-b">
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <div className="overflow-y-auto">
          <div className="p-4 space-y-4">
            {user && (
              <div className="flex items-center space-x-3 mb-6">
                <Avatar>
                  <AvatarImage
                    src={getAvatarUrl(user.avatar) || user.avatar || undefined}
                  />
                  <AvatarFallback>{user.name?.[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
            )}

            <div className="space-y-1">
              <Accordion type="single" collapsible>
                <AccordionItem value="movies">
                  <AccordionTrigger>Movies</AccordionTrigger>
                  <AccordionContent>
                    <div className="pl-4 space-y-2">
                      <MobileNavItem href="/movies/popular" icon={Star}>
                        Popular
                      </MobileNavItem>
                      <MobileNavItem href="/movies/now-playing" icon={Film}>
                        Now Playing
                      </MobileNavItem>
                      <MobileNavItem href="/movies/upcoming" icon={Film}>
                        Upcoming
                      </MobileNavItem>
                      <MobileNavItem href="/movies/top-rated" icon={Star}>
                        Top Rated
                      </MobileNavItem>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="tv">
                  <AccordionTrigger>TV Shows</AccordionTrigger>
                  <AccordionContent>
                    <div className="pl-4 space-y-2">
                      <MobileNavItem href="/tv/popular" icon={Star}>
                        Popular
                      </MobileNavItem>
                      <MobileNavItem href="/tv/airing-today" icon={Tv}>
                        Airing Today
                      </MobileNavItem>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <MobileNavItem href="/people" icon={User}>
                People
              </MobileNavItem>

              {user ? (
                <>
                  <MobileNavItem href="/watchlist" icon={List}>
                    My Watchlist
                  </MobileNavItem>
                  <MobileNavItem href="/ratings" icon={Star}>
                    My Ratings
                  </MobileNavItem>
                  <MobileNavItem href="/profile" icon={User}>
                    Profile
                  </MobileNavItem>
                  <MobileNavItem href="/settings" icon={Settings}>
                    Settings
                  </MobileNavItem>
                  <Link href="/api/auth/signout">
                    <div className="flex items-center gap-3 p-3 text-destructive hover:bg-destructive/10 rounded-md">
                      <LogOut className="h-5 w-5" />
                      <span className="font-medium">Sign Out</span>
                    </div>
                  </Link>
                </>
              ) : (
                <div className="space-y-2 pt-4">
                  <Link href="/auth/signin">
                    <Button variant="outline" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button className="w-full">Sign Up</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
