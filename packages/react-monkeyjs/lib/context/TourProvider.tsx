import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { stepComponent, Tour, ThemeType, PopoverBuilderConfig } from 'monkeyts';

type ContextType = {
  start: () => Promise<void>;
  isTourActive: boolean;
  distroy: () => void;
};

const Context = createContext<ContextType>({
  start: async () => {},
  isTourActive: false,
  distroy: () => {},
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
  const [isTourActive, setIsTourActive] = useState(false);

  const tour = useMemo(
    () =>
      new Tour(
        {
          controllerConfig: { steps },
          tourConfig: config,
        },
        theme,
      ),
    // Tour is created once on mount. Steps, config, and theme are read at
    // initialization time. Re-mounting the component (or unmounting and
    // remounting) will create a fresh tour with updated props.
    [],
  );

  useEffect(() => {
    tour.initTour();

    const handleStart = () => setIsTourActive(true);
    const handleEnd = () => setIsTourActive(false);

    window.addEventListener('onStart', handleStart);
    window.addEventListener('onEnd', handleEnd);

    return () => {
      window.removeEventListener('onStart', handleStart);
      window.removeEventListener('onEnd', handleEnd);
      tour.distroy();
    };
  }, [tour]);

  const start = useCallback(async () => {
    await tour.start();
  }, [tour]);

  const distroy = useCallback(() => {
    tour.distroy();
  }, [tour]);

  return (
    <Context.Provider
      value={{
        start,
        isTourActive,
        distroy,
      }}
    >
      {children}
    </Context.Provider>
  );
};
