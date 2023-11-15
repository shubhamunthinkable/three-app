// import logo from './logo.svg';
import "./App.css";
import PieChart3D from "./component/PieChart3D";

function App() {
  const data = [
    { value: 10, color: "#F9FD62" },
    { value: 25, color: "#A2DEF2" },
    { value: 8, color: "#EF0303" },
    { value: 20, color: "#46E111" },
    { value: 5, color: "#0DD4FD" },
    { value: 35, color: "#02025c" },//
    { value: 15, color: "#ED12DE" },
    { value: 6, color: "#FEBF10" },
    // { value: 55, color: '#0DD4FD' },
    // { value: 70, color: '#FE1010' },
    // { value: 80, color: '#4EF414' },
    // { value: 105, color: '#F20881' },
    // { value: 90, color: '#FEBF10' },
    // { value: 5, color: 'green' },
    // { value: 15, color: '#1A5276' },
    // { value: 90, color: '#BDC3C7' },
  ];

  return (
    <div>
      <PieChart3D data={data} />
    </div>
  );
}

export default App;
