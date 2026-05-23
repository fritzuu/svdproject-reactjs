import { ThemeProvider } from "./context/ThemeContext";
import { HistoryProvider } from "./context/HistoryContext";
import HomePage from "./pages/HomePage";

export default function App() {
  return (
    <ThemeProvider>
      <HistoryProvider>
        <HomePage />
      </HistoryProvider>
    </ThemeProvider>
  );
}
