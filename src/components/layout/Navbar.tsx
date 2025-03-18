import { useState} from "react";
import { Link, useLocation, useNavigate } from "react-router";
import {Menu } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet"; // For mobile menu

const NAV_LINKS = [
  { path: "/", label: "Home" },
  { path: "/login", label: "Login" },
  { path: "/register", label: "Register" },
];

const LOGGEDIN_USER_LINKS = [
  { path: "/dashboard", label: "Dashboard" },
  { path: "/create-request", label: "Create Request" },
  { path: "/profile", label: "Profile" },
];

export const Navbar = () => {
  const { user, logout } = useAuth();
  // const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const getInitials = (name: string) =>
    name ? name[0].toLocaleUpperCase() : "U";

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between h-16 py-4 px-6 border-b bg-background">
      {/* Logo */}
      <Link to="/dashboard" className="text-xl font-bold">
        GameON
      </Link>

      {/* Desktop Nav Links */}
      <nav className="hidden md:flex space-x-6">
        {!user
          ? NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium ${
                  location.pathname === link.path
                    ? "text-primary"
                    : "text-muted-foreground"
                } hover:text-primary transition`}
              >
                {link.label}
              </Link>
            ))
          : LOGGEDIN_USER_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium ${
                  location.pathname === link.path
                    ? "text-primary"
                    : "text-muted-foreground"
                } hover:text-primary transition`}
              >
                {link.label}
              </Link>
            ))}
      </nav>

      {/* Right Section: Notifications + Profile */}
      <div className="flex items-center space-x-4">
       

        {/* User Profile / Authentication */}
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="capitalize font-medium">
                {user.name}
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  logout();
                  navigate("/");
                }}
              >
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link to="/login">
            <Button variant="outline">Login</Button>
          </Link>
        )}

        {/* Mobile Menu Button */}
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-64 p-6">
            <nav className="flex flex-col space-y-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-lg font-medium ${
                    location.pathname === link.path
                      ? "text-primary"
                      : "text-muted-foreground"
                  } hover:text-primary transition`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};
