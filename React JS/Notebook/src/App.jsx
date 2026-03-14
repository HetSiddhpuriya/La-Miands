import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <section className='flex h-screen'>
        
        {/* form section */}
        <div className='w-1/2 bg-emerald-100 flex items-center justify-center'>
          
          <form className='flex flex-col items-center justify-center p-10 bg-white shadow-lg rounded-lg'>
            <h1 className='text-2xl font-bold mb-4'>Create New Topic</h1>

            <input
              type="text"
              placeholder='Topics....'
              className='w-64 h-10 rounded-lg border-2 border-gray-300 p-2'
            />
            <textarea
              cols="30"
              rows="5"
              placeholder='Description...'
              className='w-64 h-32 rounded-lg border-2 border-gray-300 p-2 mt-4'
            ></textarea>
            <input
              type="submit"
              value="Create"
              className='w-32 h-10 bg-blue-500 text-white rounded-lg mt-4 cursor-pointer hover:bg-blue-600'
            />
          </form>

        </div>

        {/* right side */}
        <div className='w-1/2 bg-indigo-100 border-l-2 border-white'></div>

      </section>
    </>
  )
}

export default App