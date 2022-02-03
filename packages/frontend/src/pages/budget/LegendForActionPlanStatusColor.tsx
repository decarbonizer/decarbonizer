import { Grid, GridItem, Heading } from '@chakra-ui/react';
import Card from '../../components/Card';

export default function LegendForActionPlanStatusColor() {
  return (
    // <Card w="64" h="52" pl="5" py="5">
    //   <Heading size="sm" pb="5">
    //     Legend Action Plan Status
    //   </Heading>
    <Grid templateRows="repeat(3,1fr)" templateColumns="repeat(2,1fr)" w="52" h="32" alignItems="center" columnGap={5}>
      <GridItem rowStart={1} colSpan={1} bg="#CBD5E0" h="6" w="100%" />
      <GridItem rowStart={1} colStart={2} h="6" w="100%">
        Open
      </GridItem>

      <GridItem rowStart={2} colSpan={1} bg="#D6BCFA" h="6" w="100%" />
      <GridItem rowStart={2} colStart={2} h="6" w="100%">
        In Progress
      </GridItem>

      <GridItem rowStart={3} colSpan={1} bg="#9AE6B4" h="6" w="100%" />
      <GridItem rowStart={3} colStart={2} h="6" w="100%">
        Closed
      </GridItem>
    </Grid>
    // </Card>
  );
}
