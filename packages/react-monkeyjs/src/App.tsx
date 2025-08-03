import './App.css';
import { TourContext } from '../lib/context/TourProvider';
import Demo from './demo/Demo';
import { POPOVER_POSITION_CONSTANT, stepComponent, ThemeType } from 'monkeyts';
function App() {
  const step: stepComponent[] = [
    {
      description:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s',
      title: 'Title One',
      element: 'step-123',

      action: () => {
        console.log('hello');
        return Promise.resolve('adsf');
      },
    },
    {
      description:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s',
      title: 'Title One',
      element: 'step-1',
      condition: () => {
        return false;
      },
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
  const tourConfig = {
    isArrowVisible: true,
    isCloseBtnVisible: true,
    position: POPOVER_POSITION_CONSTANT.BOTTOM,
    overlayConfig: {
      radius: 10,
      padding: {
        top: 10,
        bottom: 10,
        right: 10,
        left: 10,
      },
    },
    progressBar: true,
    progressBarSteps: 0,
    nextBtnText: '',
    prevBtnText: '',
    offsetX: 0,
    offsetY: 0,
  };
  const theme: Partial<ThemeType> = {
    primaryBtnBgColor: '#10b981',
    secondaryBtnBgColor: '#c7cdd6ff',
    textColor: '#212529',
  };
  return (
    <TourContext steps={step} config={tourConfig} theme={theme}>
      <Demo />
    </TourContext>
  );
}

export default App;
