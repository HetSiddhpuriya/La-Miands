import { useState } from "react";

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // function changeName(e){
  //   setUsername(e.target.value)
  // }
  function submitForm(){
    console.log("login successful")
    const data = {username, password}
    console.log(data)
    setUsername('')
    setPassword('')
  }

  return (
    <>
      <h1 className="text-center mt-10 font-medium text-2xl">Two Way Binding: Login, SingUp{""}</h1>
      <section className="h-[50vh] flex-col flex justify-center items-center drop-shadow">
        <h1 className="text-shadow-md text-2xl mt-2 font-bold text-center text-shadow-gray-200">Login Form</h1>
        <form action="" autoComplete="off" onSubmit={(e)=>{e.preventDefault(); submitForm()}}>
          <input className="bg-[#555] text-white outline-none px-4 py-2 block my-2 rounded-md focus:ring-2 ring-emerald-400" type="text" value={username} onChange={(e)=>{setUsername(e.target.value)}} placeholder="Username"/>
          <input className="bg-[#555] text-white outline-none px-4 py-2 block my-2 rounded-md focus:ring-2 ring-emerald-400" type="password" value={password} onChange={(e)=>{setPassword(e.target.value)}} name="" id="" placeholder="Password"/>
          <input className="px-21.5 py-3 rounded-md bg-black text-white" type="submit" value="Login" />
        </form>
      </section>
    </>
  );
}

export default App;
