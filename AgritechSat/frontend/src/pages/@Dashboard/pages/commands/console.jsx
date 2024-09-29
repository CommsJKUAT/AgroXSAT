import React, { useState, useEffect, useRef } from "react";
import DashboardNav from "../../../@Dashboard/nav";

const Commands = () => {
  const [commands, setCommands] = useState([]);
  const [customCommand, setCustomCommand] = useState("");

  // Reference to the last message element
  const lastCommandRef = useRef(null);

  // Sample command history to pre-populate (you can replace this with real data later)
  useEffect(() => {
    const sampleHistory = [
      {
        text: "Capture Image",
        time: new Date().toLocaleTimeString(),
        type: "sent",
        status: "pending", // New status field
      },
      {
        text: "Adjust Orbit",
        time: new Date().toLocaleTimeString(),
        type: "sent",
        status: "pending", // New status field
      },
    ];
    setCommands(sampleHistory);
  }, []);

  const sendCommand = (command) => {
    const newCommand = {
      text: command,
      time: new Date().toLocaleTimeString(),
      type: "sent",
      status: "pending", // Start with a single tick (pending)
    };

    // Add the new command to the list
    setCommands((prevCommands) => [...prevCommands, newCommand]);

    // Simulate successful execution after 2 seconds
    setTimeout(() => {
      updateCommandStatus(newCommand.text, "success"); // Update to success (double tick)
    }, 2000);
  };

  const updateCommandStatus = (text, newStatus) => {
    setCommands((prevCommands) =>
      prevCommands.map((cmd) =>
        cmd.text === text ? { ...cmd, status: newStatus } : cmd
      )
    );
  };

  const handleCustomCommand = (e) => {
    e.preventDefault();
    if (customCommand.trim()) {
      sendCommand(customCommand);
      setCustomCommand("");
    }
  };

  // Scroll to the last command when a new command is added
  useEffect(() => {
    if (lastCommandRef.current) {
      lastCommandRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [commands]);

  return (
    <>
      <DashboardNav />
      <div className="pt-16 md:pt-10 bg-gray-100 min-h-screen flex flex-col items-center">
        <div className="max-w-lg w-full h-full bg-white rounded-lg shadow-lg flex flex-col">
          {/* Header */}
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold text-gray-800">
              Satellite Command Interface
            </h2>
          </div>

          {/* Scrollable Chat History */}
          <div
            className="flex-1 overflow-y-auto p-4 bg-gray-50"
            style={{ maxHeight: "400px" }}
          >
            <ul className="space-y-3">
              {commands.map((cmd, index) => (
                <li
                  key={index}
                  className={`flex ${
                    cmd.type === "sent" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg shadow-md ${
                      cmd.type === "sent"
                        ? "bg-black-olive text-white"
                        : "bg-gray-200 text-gray-900"
                    }`}
                  >
                    <div className="text-sm">{cmd.text}</div>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-200 mt-1">
                        {cmd.time}
                      </div>
                      {/* Show ticks based on status */}
                      <div className="ml-2 text-xs text-gray-400">
                        {cmd.status === "pending" ? (
                          <span>✓</span> // Single tick
                        ) : (
                          <span>✓✓</span> // Double tick on success
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
              {/* Invisible div to scroll to */}
              <div ref={lastCommandRef}></div>
            </ul>
          </div>

          {/* Fixed Predefined Command Buttons */}
          <div className="p-4 flex flex-col space-y-3 bg-white border-t">
            <button
              onClick={() => sendCommand("Capture Image")}
              className="px-4 py-2 bg-black-olive text-white rounded-lg shadow-md hover:bg-olive w-full text-left"
            >
              <div className="flex justify-between">
                <span>Capture Image</span>
                <span className="text-xs text-gray-200">
                  {new Date().toLocaleTimeString()}
                </span>
              </div>
            </button>
            <button
              onClick={() => sendCommand("Adjust Orbit")}
              className="px-4 py-2 bg-giants-orange text-white rounded-lg shadow-md w-full text-left"
            >
              <div className="flex justify-between">
                <span>Adjust Orbit</span>
                <span className="text-xs text-gray-200">
                  {new Date().toLocaleTimeString()}
                </span>
              </div>
            </button>
          </div>

          {/* Fixed Input Area */}
          <div className="p-4 border-t bg-white">
            <form onSubmit={handleCustomCommand} className="flex space-x-2">
              <input
                type="text"
                value={customCommand}
                onChange={(e) => setCustomCommand(e.target.value)}
                placeholder="Enter command"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-black-olive text-white rounded-full hover:bg-olive"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Commands;
