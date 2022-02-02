import { DefaultTooltipContent, DefaultTooltipContentProps } from 'recharts/lib/component/DefaultTooltipContent';

export default function ComparisonChartTooltip(props: DefaultTooltipContentProps) {
  const year = props.label;
  const oldFootprint = props.payload[0]?.value as number;
  const newFootprint = props.payload[1]?.value as number;
  const newFootprintValue = oldFootprint - newFootprint;
  const showedText = newFootprintValue < 0 ? 'Additional expenses' : 'Savings';

  const newPayload = [
    ...props.payload,
    {
      name: `${showedText} after ${year} years`,
      value: newFootprintValue,
    },
  ];

  return <DefaultTooltipContent {...props} payload={newPayload} label="" />;
}
