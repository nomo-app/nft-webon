import { lazy } from "react";
import "./App.css";
import { GlobalStateProvider } from "./components/global-state-provider";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const NftsOverview = lazy(() => import("./pages/NftsOverview"));
const NftDetails = lazy(() => import("./pages/NftDetails"));

function App() {
  return (
    <GlobalStateProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<NftsOverview />}
          />
          <Route
            path="/nft-details"
            element={<NftDetails />}
          />
        </Routes>
      </BrowserRouter>
    </GlobalStateProvider>
  );
}

export default App;
