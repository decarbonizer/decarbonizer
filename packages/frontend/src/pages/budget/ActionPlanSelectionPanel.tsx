import {
  Checkbox,
  VStack,
  Heading,
  CheckboxGroup,
  IconButton,
  Icon,
  HStack,
  Spacer,
  Tooltip,
  Accordion,
  AccordionItem,
  AccordionPanel,
  ButtonGroup,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  RangeSliderTrack,
  SliderMark,
  RangeSliderMark,
} from '@chakra-ui/react';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import { useParams } from 'react-router';
import { ActionPlan } from '../../api/actionPlan';
import { RealEstatePageParams } from '../../routes';
import { useGetAllActionPlansForRealEstateQuery } from '../../store/api';
import SidePanelAccordionButton from '../../components/SidePanelAccordionButton';
import SaveActionPlanModal from '../dashboard/action-panel/SaveActionPlanModal';
import { AiOutlineLineChart } from 'react-icons/ai';
import { MdPendingActions } from 'react-icons/md';
import { GiFootprint } from 'react-icons/gi';
import { BiEuro } from 'react-icons/bi';
import { BudgetChartMode } from './BudgetChart';

export interface ActionPlanSelectionPanelProps {
  minYear: number;
  maxYear: number;
  fromYear: number;
  setFromYear: Dispatch<SetStateAction<number>>;
  toYear: number;
  setToYear: Dispatch<SetStateAction<number>>;
  budgetChartMode: BudgetChartMode;
  setBudgetChartMode: Dispatch<SetStateAction<BudgetChartMode>>;
  actionPlans: Array<ActionPlan>;
  setActionPlans: Dispatch<SetStateAction<Array<ActionPlan>>>;
}

export default function ActionPlanSelectionPanel({
  minYear,
  maxYear,
  fromYear,
  setFromYear,
  toYear,
  setToYear,
  budgetChartMode,
  setBudgetChartMode,
  actionPlans,
  setActionPlans,
}: ActionPlanSelectionPanelProps) {
  const { realEstateId } = useParams<RealEstatePageParams>();
  const { data: allActionPlans } = useGetAllActionPlansForRealEstateQuery({ realEstateId });
  const [actionPlanToEdit, setActionPlanToEdit] = useState<ActionPlan | undefined>(undefined);
  const [fromYearTooltipValue, setFromYearTooltipValue] = useState(fromYear);
  const [toYearTooltipValue, setToYearTooltipValue] = useState(toYear);
  const [showYearTooltips, setShowYearTooltips] = useState(false);

  useEffect(() => {
    // Force check all action plans when the available action plans change.
    // Happens e.g. when the data is loaded for the first time or when sth. updates.
    setActionPlans(allActionPlans ?? []);
  }, [allActionPlans]);

  return (
    <VStack align="flex-start">
      <Heading as="h2" size="lg" pb="5" isTruncated>
        Budget Management
      </Heading>
      <Accordion w="100%" allowToggle defaultIndex={1}>
        <AccordionItem borderWidth="0 !important">
          <SidePanelAccordionButton title="Chart Configuration" icon={<Icon as={AiOutlineLineChart} />} />
          <AccordionPanel>
            <VStack w="100%" align="stretch" pb="8" spacing="8">
              <FormControl>
                <FormLabel htmlFor="mode">Display Mode:</FormLabel>
                <ButtonGroup id="mode" isAttached variant="outline">
                  <Button
                    leftIcon={<Icon as={BiEuro} />}
                    isActive={budgetChartMode === 'cost'}
                    isDisabled={budgetChartMode === 'cost'}
                    onClick={() => setBudgetChartMode('cost')}>
                    Budget
                  </Button>
                  <Button
                    leftIcon={<Icon as={GiFootprint} />}
                    isActive={budgetChartMode === 'co2'}
                    isDisabled={budgetChartMode === 'co2'}
                    onClick={() => setBudgetChartMode('co2')}>
                    Carbon Footprint
                  </Button>
                </ButtonGroup>
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="mode">Years:</FormLabel>
                <RangeSlider
                  colorScheme="primary"
                  aria-label={['min', 'max']}
                  min={minYear}
                  max={maxYear}
                  defaultValue={[minYear, maxYear]}
                  onChange={([from, to]) => {
                    setFromYearTooltipValue(from);
                    setToYearTooltipValue(to);
                  }}
                  onChangeStart={() => {
                    setShowYearTooltips(true);
                  }}
                  onChangeEnd={([from, to]) => {
                    setFromYear(from);
                    setToYear(to);
                    setShowYearTooltips(false);
                  }}>
                  <RangeSliderMark mt="2" value={minYear}>
                    {minYear}
                  </RangeSliderMark>
                  <RangeSliderMark mt="2" ml="-6" value={maxYear}>
                    {maxYear}
                  </RangeSliderMark>
                  <RangeSliderTrack>
                    <RangeSliderFilledTrack />
                  </RangeSliderTrack>
                  <Tooltip hasArrow placement="top" isOpen={showYearTooltips} label={fromYearTooltipValue.toString()}>
                    <RangeSliderThumb index={0} />
                  </Tooltip>
                  <Tooltip hasArrow placement="top" isOpen={showYearTooltips} label={toYearTooltipValue.toString()}>
                    <RangeSliderThumb index={1} />
                  </Tooltip>
                </RangeSlider>
              </FormControl>
            </VStack>
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem borderWidth="0 !important">
          <SidePanelAccordionButton title="Action Plans" icon={<Icon as={MdPendingActions} />} />
          <AccordionPanel>
            <CheckboxGroup
              colorScheme="primary"
              value={actionPlans.map((plan) => plan._id)}
              onChange={(selectedPlanIds) =>
                setActionPlans(allActionPlans!.filter((actionPlan) => selectedPlanIds.includes(actionPlan._id)))
              }>
              {allActionPlans?.map((actionPlan) => (
                <HStack key={actionPlan._id} w="100%">
                  <Checkbox value={actionPlan._id}>{actionPlan.name}</Checkbox>
                  <Spacer />
                  <Tooltip label="Edit...">
                    <IconButton
                      variant="ghost"
                      aria-label="Edit..."
                      icon={<Icon as={FaEdit} />}
                      onClick={() => setActionPlanToEdit(actionPlan)}
                    />
                  </Tooltip>
                </HStack>
              ))}
            </CheckboxGroup>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>

      {actionPlanToEdit && (
        <SaveActionPlanModal isOpen actionPlan={actionPlanToEdit} onClose={() => setActionPlanToEdit(undefined)} />
      )}
    </VStack>
  );
}
