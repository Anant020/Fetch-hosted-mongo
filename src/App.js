import logo from './logo.svg';
import './App.css';
import TerrainAnalysisComponent from './TerrainAnalysisComponent';
import { useCallback, useEffect, useState } from 'react';
// import Navbar from './Navbar';
function App() {
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://mongo-backend-dmzi.onrender.com/users');
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);
  return (
    <div className="">
      {/* <Navbar/> */}
      {/* <TerrainAnalysisComponent/> */}
      <h1 className=" text-xl text-fuchsia-600">Frontend Connected</h1>
      <div>
        {data.map((item, index) => (
          <div key={index} className=' flex my-2 text-white font-medium'>
            <h1 className=' px-2 bg-emerald-400 rounded-lg mx-2'>{item.name}</h1>
            <h1 className='px-2 bg-emerald-400 rounded-lg mx-2'>{item.age}</h1>
            <h1 className = 'px-2 bg-emerald-400 rounded-lg mx-2'>{item.status.toString()}</h1> 
          </div> 
        ))}
      </div>
    </div>
  );
}

export default App;
