import { useState } from "react";

function App() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <section>
        <h1 className="text-4xl text-center mt-10 font-extrabold">
          useState = change value of variable (variable no data change kari shakay)
        </h1>

        <p className="text-3xl text-center font-bold my-4">
          Increase and Decrease Counter
        </p>

        {/* Counter Box */}
        <div className="w-72 h-72 bg-[#222] text-white rounded-xl px-4 py-2 flex items-center justify-center text-[15rem] font-bold mx-auto">
          {number}
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-center py-6 gap-6">
          <button
            className="py-4 px-8 text-4xl rounded-lg bg-[#555] text-white active:scale-95 transition"
            onClick={() => setNumber((count) => count + 1)}
          >
            Increase
          </button>

          <button
            className="py-4 px-8 text-4xl rounded-lg bg-[#555] text-white active:scale-95 transition"
            onClick={() => setNumber((count) => count - 1)}
          >
            Decrease
          </button>
        </div>
      </section>
    </>
  );
}

export default App;