
  import { createRoot } from "react-dom/client";
  import App from "./app/App";
  import "./app/partnerCollaborationEnhancer";
  import "./app/partnerValueSectionRemoval";
  import "./app/partnerFormPremiumEnhancer";
  import "./styles/index.css";

  createRoot(document.getElementById("root")!).render(<App />);
  