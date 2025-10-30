import React from "react";
import { calculateSpeedKmH, calculateETA } from "../utils/speed";

/**
 * Modern Glass UI Controls — Vehicle status & playback controller
 */
function Controls({
  currentPosition,
  currentIndex,
  routeData,
  isPlaying,
  onPlay,
  onPause,
  onReset,
  onSpeedChange,
  simulationSpeed,
}) {
  const speed = calculateSpeedKmH(currentIndex, routeData);
  const eta = calculateETA(currentIndex, routeData);
  const progress =
    routeData.length > 0
      ? ((currentIndex / (routeData.length - 1)) * 100).toFixed(1)
      : 0;

  return (
    <div className="absolute top-5 left-5 z-[1000] w-full max-w-xs md:max-w-sm 
      backdrop-blur-md bg-[#0f172a]/70 border border-cyan-400/30 
      shadow-[0_0_25px_rgba(34,211,238,0.3)] rounded-2xl p-5 text-gray-100 transition-all duration-300">

      <h2 className="text-lg font-semibold text-cyan-300 mb-3 tracking-wide">
        🚗 Vehicle Dashboard
      </h2>

      {/* Status */}
      <div className="space-y-2 text-sm mb-4">
        <div className="flex justify-between">
          <span className="text-gray-400">Coordinates:</span>
          <span className="font-mono text-cyan-400 text-xs">
            {currentPosition?.lat?.toFixed(6)}, {currentPosition?.lng?.toFixed(6)}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-400">Timestamp:</span>
          <span className="font-medium text-gray-200">
            {currentPosition?.timestamp
              ? new Date(currentPosition.timestamp).toLocaleTimeString()
              : "N/A"}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-400">Speed:</span>
          <span className="font-semibold text-cyan-300">{speed} km/h</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-400">ETA:</span>
          <span className="font-medium text-gray-200">{eta}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-400">Progress:</span>
          <span className="font-medium text-cyan-300">{progress}%</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="w-full bg-gray-700/40 rounded-full h-2 overflow-hidden">
          <div
            className="h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Playback Controls */}
      <div className="flex gap-2 mb-3">
        {!isPlaying ? (
          <button
            onClick={onPlay}
            className="flex-1 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 
              text-white font-semibold rounded-lg shadow-lg transition-colors duration-200"
            disabled={currentIndex >= routeData.length - 1}
          >
            ▶ Start
          </button>
        ) : (
          <button
            onClick={onPause}
            className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 
              text-white font-semibold rounded-lg shadow-lg transition-colors duration-200"
          >
            ⏸ Pause
          </button>
        )}

        <button
          onClick={onReset}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 
            text-gray-200 font-semibold rounded-lg shadow-lg transition-colors duration-200"
        >
          ⟲ Reset
        </button>
      </div>

      {/* Speed Control */}
      <div>
        <label className="block text-xs text-gray-400 mb-1">
          Simulation Speed: <span className="text-cyan-300 font-medium">{(2000 / simulationSpeed).toFixed(1)}x</span>
        </label>
        <input
          type="range"
          min="500"
          max="3000"
          step="100"
          value={simulationSpeed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-cyan-400"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>⚡ Fast</span>
          <span>🐢 Slow</span>
        </div>
      </div>
    </div>
  );
}

export default Controls;
