import "./App.css";
import { ChainSelect } from "./components/ChainSelect";
import { GlobalStateProvider } from "./components/global-state-provider";
import { NftsOverview } from "./components/NftsOverview";

function App() {
  return (
    <GlobalStateProvider>
      <h1>NFTs</h1>
      <ChainSelect />
      <NftsOverview />
      <div className="card"></div>
    </GlobalStateProvider>
  );
}

export default App;
