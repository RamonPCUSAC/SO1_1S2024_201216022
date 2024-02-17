import {useState,useEffect } from 'react';
import logo from './assets/images/logo-universal.png';
import './App.css';
import {Greet,MemoryInfo} from "../wailsjs/go/main/App";

import{
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js/auto'
import {Doughnut} from 'react-chartjs-2'

ChartJS.register(ArcElement,Tooltip,Legend)

function App() {
    const [resultText, setResultText] = useState("Please enter your name below 👇");
    const [name, setName] = useState('');
    const [totalRam, setTotalRam] = useState('')
    const [memoryStats, setMemoryStats] = useState({
        totalRam: 0,
        memoriaEnUso: 0,
        porcentaje: 0,
        libre: 0
      });
    const updateName = (e) => setName(e.target.value);
    const updateResultText = (result) => setResultText(result);

    const data = {
      labels: ['En Uso','Libre'],
      datasets:[{
        label:'Uso',
        data: [memoryStats.porcentaje,100-memoryStats.porcentaje],
        backgroundColor: ['black','red'],
        borderCOlor: ['black','red'],

      }]
    }
    const options = {

    }

    function greet() {
        Greet(name).then(updateResultText);
        MemoryInfo().then((value)=>{
            console.log(value)
            const parsedMemoryStats = JSON.parse(value)

        // Actualiza el estado con los nuevos datos
            setMemoryStats(parsedMemoryStats)
            console.log(parsedMemoryStats)
            console.log(parsedMemoryStats.totalRam)
        })
    }

    useEffect(() => {
      let isMounted = true;

        const updateMemoryStats = async () => {
          try {
            

            const memoryStatsString = await MemoryInfo()
            const parsedMemoryStats = JSON.parse(memoryStatsString)
            console.log(parsedMemoryStats)
            //setMemoryStats(parsedMemoryStats)
            if(isMounted){
              setMemoryStats(prevStats => ({
                ...prevStats,
                ...parsedMemoryStats
              }));
            //setTotalRam(parsedMemoryStats.totalRam)
              console.log(memoryStats)
              //console.log(totalRam)
            }
            
            
          } catch (error) {
            console.error('Error fetching memory stats:', error);
          }
        };
    
        // Llama a la función de actualización cada medio segundo
        const intervalId = setInterval(updateMemoryStats, 500);
    
        // Limpia el intervalo cuando el componente se desmonta
        return () => {
          isMounted = false;
          clearInterval(intervalId)
        };
      }, []);

    return (
        <div id="App">
            
            <div id="result" className="result">Porcentaje de uso {memoryStats.porcentaje} %</div>
          
            <div style={{width:'50%', height:'50%'}}>
              <Doughnut
                data= {data}
                options={options}
              />
            </div>
        </div>
    )
}

export default App
