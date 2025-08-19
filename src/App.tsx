import "./App.css";
import { GlobalStateProvider } from "./components/global-state-provider";
import { NftsOverview } from "./components/NftsOverview";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <GlobalStateProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<NftsOverview />} />
        </Routes>
      </BrowserRouter>
    </GlobalStateProvider>
  );
}

export default App;
