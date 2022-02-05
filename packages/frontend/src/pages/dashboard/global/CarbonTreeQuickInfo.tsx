import { Image, SkeletonText } from '@chakra-ui/react';
import QuickInfo, { QuickInfoProps } from '../components/QuickInfo';
import QuickInfoLabelDescription from '../components/QuickInfoLabelDescription';
import tree from './tree.png';

export interface CarbonTreeCardProps extends QuickInfoProps {
  carbonFootprint: number;
  isLoading: boolean;
}

export default function CarbonTreeQuickInfo({ isLoading, carbonFootprint, ...rest }: CarbonTreeCardProps) {
  const treeSequestrationPerYear = 21;
  const treeSequestrationPerMonth = treeSequestrationPerYear / 12;
  const calculatedTreeSequestrationPerYear = Math.round(carbonFootprint / treeSequestrationPerYear);
  const calculatedTreeSequestrationPerMonth = (carbonFootprint / treeSequestrationPerMonth).toFixed(2);
  const displayTreeSequestrationYear = `${calculatedTreeSequestrationPerYear} years`;
  const displayTreeSequestrationMonth = `${calculatedTreeSequestrationPerMonth} months`;

  return (
    <>
      {isLoading ? (
        <SkeletonText />
      ) : (
        <QuickInfo
          icon={<Image boxSize="16" src={tree} alt="Tree Image" objectFit="cover" roundedTop="md" />}
          {...rest}>
          <QuickInfoLabelDescription
            label={
              calculatedTreeSequestrationPerYear === 0 ? displayTreeSequestrationMonth : displayTreeSequestrationYear
            }
            description="Carbon sequestration"
          />
        </QuickInfo>
      )}
    </>
  );
}
