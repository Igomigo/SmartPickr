import { Landing } from "./features/search/Landing";
import { LiveView } from "./features/live/LiveView";
import { Logo } from "./ui/Logo";
import { useSearchMachine } from "./stream/useSearchMachine";

function App() {
  const machine = useSearchMachine();
  const onLanding = machine.state.phase === "idle";

  return (
    <div className="relative h-full w-full">
      <header className="absolute top-6 left-6 z-30">
        <Logo />
      </header>

      {onLanding ? (
        <Landing onSearch={(term, platforms) => machine.start(term, platforms)} />
      ) : (
        <LiveView machine={machine} />
      )}
    </div>
  );
}

export default App;
