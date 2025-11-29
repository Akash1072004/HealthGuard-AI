import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import React from "react";
import ThemeToggle from "./ThemeToggle";

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Live Demo",
    href: "/live-demo",
    description: "Experience a real-time demonstration of HealthGuard AI.",
  },
  {
    title: "Simulation Dashboard",
    href: "/live-simulation-dashboard",
    description: "Monitor live patient simulations and resource allocation.",
  },
  {
    title: "Patient Journey",
    href: "/patient-journey",
    description: "Follow a patient's journey with AI-powered care.",
  },
  {
    title: "Testimonials",
    href: "/testimonials",
    description: "Read what our partners and patients say about us.",
  },
  {
    title: "Impact Metrics",
    href: "/impact-metrics",
    description: "View key metrics showcasing HealthGuard AI's impact.",
  },
  {
    title: "FAQ",
    href: "/faq",
    description: "Find answers to frequently asked questions.",
  },
  {
    title: "Data Visualization",
    href: "/data-visualization",
    description: "Explore interactive data visualizations.",
  },
  {
    title: "Contact Us",
    href: "/contact-form",
    description: "Get in touch with the HealthGuard AI team.",
  },
  {
    title: "Resource Optimizer Agent",
    href: "/resource-optimizer",
    description: "View resource optimization recommendations.",
  },
  {
    title: "Preventive Advisory Agent",
    href: "/preventive-advisory",
    description: "📢 Public health alert system.",
  },
];

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <Link to="/" className="mr-4 flex items-center">
          <span className="font-bold text-lg bg-gradient-primary bg-clip-text text-transparent">HealthGuard AI</span>
        </Link>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link to="/" onClick={() => {
                if (useLocation().pathname === "/") {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Home
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Sections</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                  {components.map((component) => (
                    <ListItem
                      key={component.title}
                      title={component.title}
                      href={component.href}
                    >
                      {component.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/contact-form">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Contact
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <Link to="/signin">
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Link to="/signup">
            <Button>Sign Up</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default Navbar;