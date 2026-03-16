  import { createRoot } from "react-dom/client";
  import { Toaster } from "react-hot-toast";
  import App from "./app/App.tsx";
  import "./styles/index.css";

  createRoot(document.getElementById("root")!).render(
    <>
      <App />
      <Toaster position="top-center" toastOptions={{ duration: 3000, style: { fontSize: '14px' } }} />
    </>
  );
  