import { createContext, useContext, useEffect, useMemo } from 'react';
import {
  TourController,
  stepComponent,
  Tour,
  POPOVER_POSITION_CONSTANT,
} from 'monkeyts';
type ContextType = { start: TourController['start'] };
const Context = createContext<ContextType>({
  start: {} as TourController['start'],
});
export const useTourContext = (): ContextType => useContext(Context);
export type TourContextProps = {
  steps: stepComponent[];
  children: React.ReactNode;
};
const TourContext: React.FC<TourContextProps> = ({ children, steps }) => {
  const tour = useMemo(
    () =>
      new Tour({
        controllerConfig: { steps: steps },
        tourConfig: {
          isArrowVisible: true,
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
        },
      }),
    [],
  );
  useEffect(() => {
    if (tour) {
      tour.init();
      setTimeout(() => {
        tour.start();
      }, 3000);
    }
  }, []);
  return (
    <Context.Provider value={{ start: tour.start }}>
      {children}
    </Context.Provider>
  );
};

export default TourContext;
