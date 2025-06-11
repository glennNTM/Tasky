
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
      className={`h-9 w-9 p-0 hover:bg-purple-100 dark:hover:bg-purple-900 ${className}`}
    >
      {theme === 'light' ? (
        <Moon className="h-4 w-4 text-purple-600" />
      ) : (
        <Sun className="h-4 w-4 text-purple-400" />
      )}
    </Button>
  );
};

export default ThemeToggle;
