import './App.css';
import TourContext from './context/TourProvider';
import Demo from './demo/Demo';
import { stepComponent } from 'monkeyts';
function App() {
  const step: stepComponent[] = [
    { description: 'discription 1', title: 'title one', element: '#step-1' },
    { description: 'des 2', title: 'title 2', element: '#step-2' },
    { description: 'des 23', title: 'title 2', element: '#step-3' },
  ];
  return (
    <TourContext steps={step}>
      <Demo />
    </TourContext>
  );
}

export default App;
