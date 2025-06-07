
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

const ThemeToggle = ({ className = "" }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className={`h-9 w-9 p-0 hover:bg-green-100 dark:hover:bg-green-900 ${className}`}
    >
      {theme === 'light' ? (
        <Moon className="h-4 w-4 text-green-600" />
      ) : (
        <Sun className="h-4 w-4 text-green-400" />
      )}
    </Button>
  );
};

export default ThemeToggle;
