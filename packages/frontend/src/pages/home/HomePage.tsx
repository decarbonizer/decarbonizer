import { useState } from 'react';
import DefaultPageLayout from '../../components/DefaultPageLayout';
import TimeRangeInput from '../../components/TimeRangInput';
import RealEstateBox from './RealEstateBox';

export default function HomePage() {
  const [blub, setBlub] = useState<any>();
  return (
    <DefaultPageLayout title="Home">
      <RealEstateBox />
      <TimeRangeInput
        value={blub}
        onValueChanged={(e) => {
          setBlub(e);
        }}
      />
    </DefaultPageLayout>
  );
}
