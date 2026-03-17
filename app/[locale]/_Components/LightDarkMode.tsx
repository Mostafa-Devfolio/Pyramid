import { useTheme } from 'next-themes';
import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function LightDarkMode() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mount, setMount] = useState(false);

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    function getReady() {
      setMount(true);
    }
    getReady();
  }, []);

    if (!mount) {
      return (
        <div>
          <button className="flex items-center justify-center rounded-full bg-[--bg-light] p-2 transition-colors hover:bg-[--bg-light] dark:hover:bg-[--bg-light]">
            <div style={{ width: 24, height: 24 }} />
          </button>
        </div>
      );
    }

  const icon =
    resolvedTheme === 'dark' ? (
      <Sun size={24} className="text-yellow-500" />
    ) : (
      <Moon size={24} strokeWidth={2} className="text-gray-700" />
    );
    return (
      <div>
        <button
          onClick={toggleTheme}
          className="flex items-center justify-center rounded-full bg-[--bg-light] p-2 transition-colors hover:bg-[--bg-light] dark:hover:bg-[--bg-light]"
        >
          {icon}
        </button>
      </div>
    );
}
