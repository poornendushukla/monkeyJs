import { createContext, useContext, useEffect, useMemo } from 'react';
import { TourController, stepComponent, Tour } from 'monkeyts';
import { PopoverBuilderConfig } from 'monkeyts/dist/component/popover/PopoverBuilder';
type ContextType = { start: TourController['start'] };
const Context = createContext<ContextType>({
  start: {} as TourController['start'],
});
export const useTourContext = (): ContextType => useContext(Context);
export type TourContextProps = {
  steps: stepComponent[];
  config: PopoverBuilderConfig;
  children: React.ReactNode;
};

const TourContext: React.FC<TourContextProps> = ({
  children,
  steps,
  config,
}) => {
  const tour = useMemo(
    () =>
      new Tour({
        controllerConfig: { steps: steps },
        tourConfig: config,
      }),
    [],
  );
  useEffect(() => {
    if (tour?.isTourActive) {
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
