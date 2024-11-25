import "./App.css";
import TourContext from "./context/TourProvider";
import { stepComponent } from "./component/core/tour/TourBuilder";
export default function App() {
  const step: stepComponent[] = [
    { description: "discription 1", title: "title one", element: "#step-1" },
    { description: "des 2", title: "title 2", element: "#step-2" },
    { description: "des 23", title: "title 2", element: "#step-3" },
  ];
  return (
    <div>
      <TourContext steps={step}>
        <div
          style={{
            display: "flex",
            padding: "10px",
            justifyContent: "space-between",
          }}
        >
          <div
            id="step-1"
            style={{ width: "100px", height: "100px", background: "red" }}
          ></div>
          <div
            id="step-2"
            style={{ width: "100px", height: "100px", background: "green" }}
          ></div>
        </div>
        <div
          style={{ width: "100px", height: "100px", background: "purple" }}
          id="step-3"
        ></div>
      </TourContext>
    </div>
  );
}
