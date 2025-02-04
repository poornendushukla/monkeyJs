import { createContext, useContext, useEffect, useMemo } from 'react';
import {
  TourController,
  stepComponent,
  Tour,
  ThemeType,
  PopoverBuilderConfig,
} from 'monkeyts';
type ContextType = {
  start: TourController['start'];
  isTourActive: boolean;
  distroy: TourController['distroy'];
};
const Context = createContext<ContextType>({
  start: {} as Tour['start'],
  isTourActive: false,
  distroy: {} as Tour['distroy'],
});
export const useTourContext = (): ContextType => useContext(Context);
export type TourContextProps = {
  steps: stepComponent[];
  config: PopoverBuilderConfig;
  theme?: Partial<ThemeType>;
  children: React.ReactNode;
};

export const TourContext: React.FC<TourContextProps> = ({
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
  }, [tour, tour?.isTourActive]);
  return (
    <Context.Provider
      value={{
        start: tour.start,
        isTourActive: tour.isTourActive,
        distroy: tour.distroy,
      }}
    >
      {children}
    </Context.Provider>
  );
};
