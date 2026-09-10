'use client';

import { Toaster } from 'sonner';
import { useTheme } from './ThemeProvider';

export default function ThemeAwareToaster() {
  const { theme } = useTheme();

  return <Toaster richColors position="top-center" theme={theme} />;
}
