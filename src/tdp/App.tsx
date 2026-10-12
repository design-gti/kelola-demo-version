// @ts-nocheck -- ported from tdp-prototype (Vite, never tsc-checked); not type-maintained here
import { RouterProvider } from 'react-router';
import { router } from './routes';

/*
  `TooltipProvider` Radix DIBUANG dari sini.

  Ia satu-satunya sisa pemakaian `./components/ui/tooltip` di seluruh `src/tdp`
  sesudah enam tooltip di `TableScreener` pindah ke `Tooltip` design system.
  Mantine tidak butuh provider: setiap `Tooltip` mengurus portal dan penundaannya
  sendiri.

  Dibiarkan pun tak akan merusak apa pun — ia hanya penyedia context yang tak ada
  yang membacanya. Tapi provider tanpa konsumen adalah jejak yang menyesatkan
  pembaca berikutnya: ia menyiratkan tooltip di pulau ini masih Radix.
*/
export default function App() {
  return <RouterProvider router={router} />;
}
