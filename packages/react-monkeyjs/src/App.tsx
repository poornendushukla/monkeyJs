import './App.css';
import TourContext from './context/TourProvider';
import Demo from './demo/Demo';
import { stepComponent } from 'monkeyts';
function App() {
  const step: stepComponent[] = [
    {
      description:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s',
      title: 'Title One',
      element: 'step-1',
    },
    {
      description:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy text ever since the 1500s',
      title: 'Title 2',
      element: 'step-2',
    },
    {
      description:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy text ever since the 1500s',
      title: 'Title 3',
      element: 'step-3',
    },
    {
      description:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy text ever since the 1500s',
      title: 'Title 4',
      element: 'step-4',
    },
    {
      description:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy text ever since the 1500s',
      title: 'Title 5',
      element: 'step-5',
    },
    {
      description:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy text ever since the 1500s',
      title: 'Title 6',
      element: 'step-6',
    },
  ];
  return (
    <TourContext steps={step}>
      <Demo />
    </TourContext>
  );
}

export default App;
