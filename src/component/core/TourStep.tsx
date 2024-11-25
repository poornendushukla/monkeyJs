import React from 'react';

type Step={
  title:string;
  description:string;
}
export type TourStepProps = {
  step: Step;
  prevStep:()=>void;
  nextStep:()=>void;
  endTour:()=>void;
  isFirst:boolean;
  isLast:boolean;
}
const TourStep:React.FC<TourStepProps> = ({ step, prevStep, nextStep, endTour, isFirst, isLast }) => {
  return (
    <div className="tour-step">
      <div className="tour-content">
        <h3>{step.title}</h3>
        <p>{step.description}</p>
      </div>
      <div className="tour-controls">
        <button onClick={prevStep} disabled={isFirst}>
          Prev
        </button>
        {isLast ? (
          <button onClick={endTour}>Done</button>
        ) : (
          <button onClick={nextStep}>Next</button>
        )}
      </div>
    </div>
  );
};

export default TourStep;