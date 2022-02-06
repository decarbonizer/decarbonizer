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
  FormLabel,
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  RangeSliderTrack,
  RangeSliderMark,
  Switch,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
} from '@chakra-ui/react';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import { useHistory, useParams } from 'react-router';
import { ActionPlan } from '../../api/actionPlan';
import { RealEstatePageParams, routes } from '../../routes';
import { useGetAllActionPlansForRealEstateQuery } from '../../store/api';
import SidePanelAccordionButton from '../../components/SidePanelAccordionButton';
import SaveActionPlanModal from '../dashboard/action-panel/SaveActionPlanModal';
import { AiOutlineLineChart } from 'react-icons/ai';
import { MdPendingActions } from 'react-icons/md';
import { GiFootprint } from 'react-icons/gi';
import { BiEuro } from 'react-icons/bi';
import { BsTable } from 'react-icons/bs';
import { FaRegQuestionCircle } from 'react-icons/fa';
import { BudgetChartConfig } from './BudgetChart';
import BudgetTableModal from './components/BudgetTableModal';
import { RiDashboardFill } from 'react-icons/ri';
import LegendForActionPlanStatusColor from './LegendForActionPlanStatusColor';
import { Link } from 'react-router-dom';

export interface ActionPlanSelectionPanelProps {
  minYear: number;
  maxYear: number;
  actionPlans: Array<ActionPlan>;
  setActionPlans: Dispatch<SetStateAction<Array<ActionPlan>>>;
  budgetChartConfig: BudgetChartConfig;
  setBudgetChartConfig: (value: SetStateAction<BudgetChartConfig | null | undefined>) => void;
}

export default function ActionPlanSelectionPanel({
  minYear,
  maxYear,
  actionPlans,
  setActionPlans,
  budgetChartConfig,
  setBudgetChartConfig,
}: ActionPlanSelectionPanelProps) {
  const { realEstateId } = useParams<RealEstatePageParams>();
  const { data: allActionPlans } = useGetAllActionPlansForRealEstateQuery({ realEstateId });
  const [actionPlanToEdit, setActionPlanToEdit] = useState<ActionPlan | undefined>(undefined);
  const [fromYearTooltipValue, setFromYearTooltipValue] = useState(budgetChartConfig.fromYear);
  const [toYearTooltipValue, setToYearTooltipValue] = useState(budgetChartConfig.toYear);
  const [showYearTooltips, setShowYearTooltips] = useState(false);
  const [budgetTableActionPlan, setBudgetTableActionPlan] = useState<ActionPlan | undefined>(undefined);
  const history = useHistory();

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
                    isActive={budgetChartConfig.mode === 'cost'}
                    isDisabled={budgetChartConfig.mode === 'cost'}
                    onClick={() => setBudgetChartConfig({ ...budgetChartConfig, mode: 'cost' })}>
                    Budget
                  </Button>
                  <Button
                    leftIcon={<Icon as={GiFootprint} />}
                    isActive={budgetChartConfig.mode === 'co2'}
                    isDisabled={budgetChartConfig.mode === 'co2'}
                    onClick={() => setBudgetChartConfig({ ...budgetChartConfig, mode: 'co2' })}>
                    Carbon Footprint
                  </Button>
                </ButtonGroup>
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="mode">Show years:</FormLabel>
                <RangeSlider
                  mb="8"
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
                    setBudgetChartConfig({
                      ...budgetChartConfig,
                      fromYear: from,
                      toYear: to,
                    });
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
              {budgetChartConfig.mode === 'cost' && (
                <>
                  <FormControl d="flex" alignItems="center" gap="2">
                    <Switch
                      id="show-grid"
                      colorScheme="primary"
                      size="lg"
                      isChecked={budgetChartConfig.showGrid}
                      onChange={(e) => setBudgetChartConfig({ ...budgetChartConfig, showGrid: e.target.checked })}
                    />
                    <FormLabel>Show Grid</FormLabel>
                  </FormControl>
                  <FormControl d="flex" alignItems="center" gap="2">
                    <Switch
                      id="show-costs"
                      colorScheme="primary"
                      size="lg"
                      isChecked={budgetChartConfig.showProfit}
                      onChange={(e) => setBudgetChartConfig({ ...budgetChartConfig, showProfit: e.target.checked })}
                    />
                    <FormLabel>Show Profit Line</FormLabel>
                  </FormControl>
                  <FormControl d="flex" alignItems="center" gap="2">
                    <Switch
                      id="show-reference-budget"
                      colorScheme="primary"
                      size="lg"
                      isChecked={budgetChartConfig.showReferenceBudget}
                      onChange={(e) =>
                        setBudgetChartConfig({ ...budgetChartConfig, showReferenceBudget: e.target.checked })
                      }
                    />
                    <FormLabel>Show Credit Line</FormLabel>
                  </FormControl>
                  <NumberInput
                    min={0}
                    step={1000}
                    placeholder="Budget"
                    value={budgetChartConfig.referenceBudget}
                    onChange={(e) =>
                      setBudgetChartConfig({ ...budgetChartConfig, referenceBudget: isNaN(+e) ? 0 : +e })
                    }
                    isDisabled={!budgetChartConfig.showReferenceBudget}>
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </>
              )}
            </VStack>
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem borderWidth="0 !important">
          <SidePanelAccordionButton
            title="Action Plans"
            icon={<Icon as={MdPendingActions} />}
            buttons={
              <Tooltip hasArrow label="Legend">
                <Popover trigger="hover">
                  <PopoverTrigger>
                    <IconButton variant="ghost" aria-label="info" icon={<FaRegQuestionCircle size="17" />} />
                  </PopoverTrigger>
                  <PopoverContent>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverHeader>Action Plan Status Legend</PopoverHeader>

                    <PopoverBody>
                      <LegendForActionPlanStatusColor />
                    </PopoverBody>
                  </PopoverContent>
                </Popover>
              </Tooltip>
            }
          />
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
                  <Tooltip label="Summary table">
                    <IconButton
                      variant="ghost"
                      aria-label="Summary table"
                      icon={<BsTable size="13" />}
                      onClick={() => setBudgetTableActionPlan(actionPlan)}
                    />
                  </Tooltip>
                  <Tooltip label="Dashboard">
                    <Link to={routes.realEstateDashboard({ realEstateId, actionPlanId: actionPlan._id })}>
                      <IconButton aria-label="Dashboard" variant="ghost" icon={<Icon as={RiDashboardFill} />} />
                    </Link>
                  </Tooltip>
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
        <SaveActionPlanModal
          isOpen
          actionPlan={actionPlanToEdit}
          isBudgetPage={true}
          onClose={() => setActionPlanToEdit(undefined)}
        />
      )}
      {budgetTableActionPlan && (
        <BudgetTableModal
          isOpen
          actionPlan={budgetTableActionPlan}
          onClose={() => setBudgetTableActionPlan(undefined)}
        />
      )}
    </VStack>
  );
}
