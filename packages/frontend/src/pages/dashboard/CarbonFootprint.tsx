import CarbonFootprintCard from './CarbonFootprintCard';

interface CarbonFootprintComponentProps {
  heading: string;
  carbonFootprint: number;
}

export default function CarbonFootprintComponent({ heading, carbonFootprint }: CarbonFootprintComponentProps) {
  const unitSymbol = carbonFootprint >= 1000 ? 't' : 'kg';

  return (
    <CarbonFootprintCard
      heading={heading}
      carbonFootprintValue={carbonFootprint >= 1000 ? carbonFootprint / 1000 : carbonFootprint}
      unitSymbol={unitSymbol}
    />
  );
}
