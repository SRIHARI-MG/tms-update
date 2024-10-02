import { GlobalRouter } from "./routes/RouterProvider";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <>
      <GlobalRouter />
      <Toaster />
    </>
  );
}

export default App;
