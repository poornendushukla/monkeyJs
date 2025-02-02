import { createContext, useContext, useEffect, useMemo } from 'react';
import { TourController, stepComponent, Tour, ThemeType } from 'monkeyts';
import { PopoverBuilderConfig } from 'monkeyts/dist/component/popover/PopoverBuilder';
type ContextType = { start: TourController['start'] };
const Context = createContext<ContextType>({
  start: {} as TourController['start'],
});
export const useTourContext = (): ContextType => useContext(Context);
export type TourContextProps = {
  steps: stepComponent[];
  config: PopoverBuilderConfig;
  theme?: Partial<ThemeType>;
  children: React.ReactNode;
};

const TourContext: React.FC<TourContextProps> = ({
  children,
  steps,
  config,
  theme,
}) => {
  const tour = useMemo(
    () =>
      new Tour(
        {
          controllerConfig: { steps: steps },
          tourConfig: config,
        },
        theme,
      ),
    [],
  );
  useEffect(() => {
    if (!tour?.isTourActive) {
      tour.initTour();
    }
    if (tour?.isTourActive) {
      setTimeout(async () => {
        await tour.start();
      }, 3000);
    }
  }, [tour, tour?.isTourActive]);
  return (
    <Context.Provider value={{ start: tour.start }}>
      {children}
    </Context.Provider>
  );
};

export default TourContext;
