import { DefaultTooltipContent, DefaultTooltipContentProps } from 'recharts/lib/component/DefaultTooltipContent';

export default function ComparisonChartTooltip(props: DefaultTooltipContentProps) {
  const year = props.label;
  const oldFootprint = props.payload[0]?.value as number;
  const newFootprint = props.payload[1]?.value as number;

  const newPayload = [
    ...props.payload,
    {
      name: `Savings after ${year} years`,
      value: newFootprint - oldFootprint,
    },
  ];

  return <DefaultTooltipContent {...props} payload={newPayload} label="" />;
}
