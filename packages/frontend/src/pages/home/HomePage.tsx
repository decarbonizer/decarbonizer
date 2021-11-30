import DefaultPageLayout from '../../components/DefaultPageLayout';
import SortingSelection from '../../components/SortingSelection';
import RealEstateBox from './RealEstateBox';

export default function HomePage() {
  return (
    <DefaultPageLayout title="Home">
      <RealEstateBox />
      <SortingSelection
        sortingCategories={[
          { value: 'test1', display: 'test1' },
          { value: 'test2', display: 'test2' },
        ]}
        onChange={(e) => console.log(e)}
      />
    </DefaultPageLayout>
  );
}
