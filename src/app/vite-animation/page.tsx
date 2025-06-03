import AnimatedStreaks from './AnimatedStreaks';
import CentralNode from './CentralNode';
import BranchLines from './BranchLines';
import OutputLines from './OutputLines'; // Import the new component

const ViteAnimationPage = () => {
  return (
    <>
      <style jsx global>{`
        @keyframes masterLoop {
          0%, 100% { opacity: 1; /* Dummy property for loop timing */ }
        }
        .animation-loop-wrapper {
          animation: masterLoop 4s linear infinite;
        }
      `}</style>
      <main className="min-h-screen bg-gradient-to-r from-[#0f1f40] to-[#2b0f48] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden"> {/* Added overflow-hidden */}
        {/* SVG animation canvas */}
        <svg
          className="absolute inset-0 w-full h-full z-0"
          preserveAspectRatio="xMidYMid meet" // Good practice for responsiveness
          viewBox="0 0 1000 600" // Set the viewBox
        >
          <g className="animation-loop-wrapper">
            <AnimatedStreaks />
            <CentralNode />
            <BranchLines />
            <OutputLines /> {/* Render the output lines and dots */}
          </g>
        </svg>

        {/* Static content (text and buttons) */}
      <div className="text-center z-10 relative"> {/* Ensure static content also has relative positioning or is aware of stacking context */}
        <h1 className="text-5xl font-semibold text-[#F5F5F7]">
          The Build Tool
          <br />
          <span className="text-5xl font-semibold text-[#F5F5F7]">for the Web</span>
        </h1>
        <p className="mt-4 text-lg text-[#BBBBBB]">
          Vite is a blazing fast frontend build tool powering the next generation of web applications.
        </p>
        <div className="mt-8 flex justify-center space-x-4">
          <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-3 px-6 rounded-lg shadow-md">
            Get started
          </button>
          <button className="bg-transparent hover:bg-gray-700 text-white font-medium py-3 px-6 border border-gray-400 rounded-lg">
            GitHub
          </button>
        </div>
      </div>
      {/* SVG animation canvas has been added above the static content div */}
    </main>
  );
};

export default ViteAnimationPage;
