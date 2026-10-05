import { useEffect, useState } from "react";
import "./App.css";
import rocket from "./assets/rocket.png";
import tower from "./assets/tower.png";

function App() {
  const [rocketPosition, setRocketPosition] = useState({
    x: 500,
    y: 10,
  });

  const [landingPosition] = useState({
    x: 200,
    y: 230,
  });

  const [isLanded, setIsLanded] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameResult, setGameResult] = useState(null);

  // Move rocket using keyboard
  useEffect(() => {
    function handleKeyDown(event) {
      const step = 10;

      setRocketPosition((prev) => {
        let newX = prev.x;
        let newY = prev.y;

        if (event.key === "ArrowUp") {
          newY -= step;
        }

        if (event.key === "ArrowDown") {
          newY += step;
        }

        if (event.key === "ArrowLeft") {
          newX -= step;
        }

        if (event.key === "ArrowRight") {
          newX += step;
        }

        newX = Math.max(0, Math.min(newX, 700));
        newY = Math.max(0, Math.min(newY, 500));

        return {
          x: newX,
          y: newY,
        };
      });
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // gravity
  useEffect(() => {
    if (isLanded) return;

    const gravity = setInterval(() => {
      setRocketPosition((prev) => {
        const rocketLeft = prev.x;
        const rocketRight = prev.x + 50;

        const landingLeft = landingPosition.x + 80;
        const landingRight = landingPosition.x + 130;

        // to check whether the bottom of the rocket has reached the top of the landing platform
        const isHorizontallyAligned =
          rocketLeft >= landingLeft && rocketRight <= landingRight;
        const isVerticallyAligned = prev.y >= landingPosition.y + 50;

        if (isHorizontallyAligned && isVerticallyAligned) {
          setIsLanded(true);
          setGameResult("success");
          setIsGameOver(true);
          return {
            ...prev,
            y: landingPosition.y + 90,
          };
        } else if (prev.y > landingPosition.y + 50) {
          setIsGameOver(true);
          setGameResult("crash");
          return {
            ...prev,
          };
        }

        return {
          ...prev,
          y: prev.y + 2,
        };
      });
    }, 50);

    return () => {
      clearInterval(gravity);
    };
  }, [isLanded, isGameOver]);

  function restartGame() {
    setRocketPosition({
      x: 500,
      y: 10,
    });

    setGameResult(null);
    setIsGameOver(false);
    setIsLanded(false);
  }

  return (
    <main className="game-container">
      <header className="game-header">
        <h1>🚀 Rocket Landing</h1>
        <p>Guide the rocket safely to the landing stage</p>
      </header>

      <section className="game-layout">
        {/* LEFT SIDE - GAME STAGE */}
        <div className="game-stage">
          <div
            className="rocket"
            style={{
              left: `${rocketPosition.x}px`,
              top: `${rocketPosition.y}px`,
            }}
          >
            <div className="rocket-body">
              <img src={rocket} alt="" />
            </div>
            <div className="flame">🔥</div>
          </div>

          <div
            className="landing-tower"
            style={{
              left: `${landingPosition.x}px`,
              top: `${landingPosition.y}px`,
            }}
          >
            <img src={tower} alt="" />
            <div className="landing-pad"></div>
          </div>
        </div>

        {/* RIGHT SIDE - CONTROLS */}
        <aside className="control-panel">
          <div className="status-card">
            <h2>🚀 Rocket Status</h2>

            <div className="status-row">
              <span>X Left, Right Position</span>
              <strong>
                {rocketPosition.x}, {rocketPosition.x + 50}
              </strong>
            </div>

            <div className="status-row">
              <span>Y Position</span>
              <strong>{rocketPosition.y}</strong>
            </div>

            <div className="status-row">
              <span>is Landing?</span>
              <strong>{isLanded ? "Landed 🚀" : "Flying"}</strong>
            </div>

            <div className="status-divider"></div>

            <h2>🏗️ Landing Pad</h2>

            <div className="status-row">
              <span>X Left, Right Position</span>
              <strong>
                {landingPosition.x + 80}, {landingPosition.x + 130}
              </strong>
            </div>

            <div className="status-row">
              <span>Y Position</span>
              <strong>{landingPosition.y + 90}</strong>
            </div>
          </div>

          <div className="controls-card">
            <h2>Controls</h2>
            <p>Use arrow keys in keyboard</p>

            <div className="d-pad">
              <button className="control-btn up">↑</button>

              <button className="control-btn left">←</button>

              <button className="control-btn center">↓</button>

              <button className="control-btn right">→</button>
            </div>
          </div>
        </aside>
        {/* Game Result - pop up */}
        {isGameOver && (
          <div className="game-over-overlay">
            <div className="result-popup">
              {gameResult === "success" ? (
                <>
                  <h2>🎉 Congratulations!</h2>
                  <p>You landed successfully!</p>
                  <button onClick={restartGame}>Restart</button>
                </>
              ) : (
                <>
                  <h2>💥</h2>
                  <p>You missed the landing pad.</p>
                  <button onClick={restartGame}>Try Again</button>
                </>
              )}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

export default App;
