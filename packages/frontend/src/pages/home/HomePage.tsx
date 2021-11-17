import DefaultPageLayout from '../../components/DefaultPageLayout';
import RealEstateBox from './RealEstateBox';

export default function HomePage() {
  return (
    <DefaultPageLayout title="Dashboard">
      <RealEstateBox />
    </DefaultPageLayout>
  );
}
