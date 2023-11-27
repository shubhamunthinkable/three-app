// import logo from './logo.svg';
import "./App.css";
import ThreeDBarGraph from "./component/BarGraph3D";
import PieChart3D from "./component/PieChart3D";

function App() {
  const data = [
    { value: 2, color: "#9400D3" },
    { value: 4, color: "#4B0082" },
    { value: 6, color: "#0000FF" },
    { value: 8, color: "#00FF00" },
    { value: 10, color: "#FFFF00" },
    { value: 12, color: "#FF7F00" },
    { value: 14, color: "#BDC3C7" },
    // { value: 10, color: "#F9FD62" },
    // { value: 9, color: "#A2DEF2" },
    // { value: 8, color: "#EF0303" },
    // { value: 2, color: "#46E111" },
    // { value: 5, color: "#0DD4FD" },
    // { value: 5, color: "#02025c" },//
    // { value: 12, color: "#ED12DE" },
    // { value: 6, color: "#FEBF10" },
    // { value: 55, color: '#0DD4FD' },
    // { value: 70, color: '#FE1010' },
    // { value: 80, color: '#4EF414' },
    // { value: 105, color: '#F20881' },
    // { value: 90, color: '#FEBF10' },
    // { value: 5, color: 'green' },
    // { value: 15, color: '#1A5276' },
    // { value: 90, color: '#BDC3C7' },
  ];
  // const data = [5, 10, 15, 20, 25]; // Example data


  return (
    <div>
      <PieChart3D data={data} />
      {/* <ThreeDBarGraph data={data}/> */}
    </div>
  );
}

export default App;
