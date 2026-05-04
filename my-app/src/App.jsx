import { useState,useEffect } from "react";

function App() {
  const [data,setData]=useState([]);
  const [loading,setLoading]=useState(true);
  const [error, setError] = useState(null);
  // const [count, setCount] = useState(0);
  function fetchusers(){
    setLoading(true);
    setError(null);
    fetch("https://jsonplaceholder.typicode.com/users")
        .then((res)=>res.json())
        .then((result)=>{
          setData(result); 
          setLoading(false)
      })
      .catch(()=>{
        setError("Failed to fetch data")
        setLoading(false)
      });
  }
  useEffect(()=>{
      fetchusers();
  },[]);
  if(loading){
    return <h1>Loading users...</h1>
  }
  if (error) {
    return <h1>{error}</h1>;
  }
  return(
    <>
      <h1>Users:</h1>
      {data.slice(0, 5).map((item)=>(
        <div key={item.id}>
          <p>Name: {item.name}</p>
          <p>Email: {item.email}</p>
          <p>Address: {item.address.city}</p>
          <br/>
        </div>
      ))}
      <button onClick={fetchusers}>Refresh Users</button>
    </>
  )
};
export default App;