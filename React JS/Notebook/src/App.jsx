import { useState } from "react"

function App() {

  const [notes, setNotes] = useState("")
  const [tasks, setTasks] = useState([])
  const [heading, setHeading] = useState("")

  function submitForm() {

    let card = [...tasks]

    card.push({
      Title: heading,
      Topics: notes
    })

    setTasks(card)

    setNotes("")
    setHeading("")
  }

  return (
    <>
      <section className="md:flex">

        {/* LEFT SIDE */}
        <div className="md:w-1/2 bg-indigo-100 h-screen relative flex justify-center items-center">

          {/* Background Cards */}
          <div className="absolute top-20 left-10 rotate-[-8deg] opacity-40">
            <div className="w-60 h-40 bg-yellow-300 rounded-xl shadow-lg p-4">
              <p className="font-bold">Example Note</p>
              <p className="text-sm">This is a preview card.</p>
            </div>
          </div>

          <div className="absolute bottom-24 right-10 rotate-[10deg] opacity-40">
            <div className="w-60 h-40 bg-yellow-300 rounded-xl shadow-lg p-4">
              <p className="font-bold">Reminder</p>
              <p className="text-sm">Your notes will appear here.</p>
            </div>
          </div>


          {/* FORM */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              submitForm()
            }}
            className="z-10 flex flex-col gap-5"
          >

            <h2 className="font-bold text-3xl text-center">Create a Note</h2>

            <input
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
              type="text"
              className="font-bold bg-white border w-80 border-emerald-700 px-4 py-2 outline-none text-emerald-700 rounded-md"
              placeholder="Heading"
            />

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Topics..."
              className="bg-white w-80 border border-emerald-700 px-4 py-2 outline-none text-emerald-700 rounded-md"
            ></textarea>

            <input
              type="submit"
              value="Submit"
              className="py-2 bg-cyan-300 rounded-md cursor-pointer hover:bg-cyan-400"
            />

          </form>
        </div>


        {/* RIGHT SIDE NOTES */}
        <div className="md:w-1/2 bg-emerald-100 min-h-screen border-l-2 border-white p-6">

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {tasks.map((task, index) => {
              return (
                <div
                  key={index}
                  className="w-full h-60 bg-white rounded-2xl p-4 shadow-xl relative flex flex-col"
                >
                  <img
                    src="https://pngimg.com/d/pin_PNG76.png"
                    alt=""
                    className="h-10 absolute -top-4 left-1/2 -translate-x-1/2"
                  />

                  <div className="bg-yellow-400 rounded-xl p-4 h-full mt-4 overflow-hidden">
                    <p className="text-xl font-semibold">{task.Title}</p>
                    <p className="text-sm mt-2 break-words">{task.Topics}</p>
                  </div>

                </div>
              )
            })}

          </div>

        </div>

      </section>
    </>
  )
}

export default App