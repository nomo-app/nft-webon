import "./App.css";
import { ChainSelect } from "./components/ChainSelect";
import { GlobalStateProvider } from "./components/global-state-provider";

function App() {
  return (
    <GlobalStateProvider>
      <h1>NFTs</h1>
      <ChainSelect />
      <div className="card"></div>
    </GlobalStateProvider>
  );
}

export default App;
