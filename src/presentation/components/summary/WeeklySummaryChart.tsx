import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { DailySummary } from '../../../domain/entities/Workout';

interface WeeklySummaryChartProps {
  dailySummaries: DailySummary[];
}

const WeeklySummaryChart: React.FC<WeeklySummaryChartProps> = ({
  dailySummaries,
}) => {
  // Format dates for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  // Prepare data for charts
  const labels = dailySummaries.map(day => formatDate(day.date));
  const completedData = dailySummaries.map(day => day.completed);
  const totalData = dailySummaries.map(day => day.workouts);

  const screenWidth = Dimensions.get('window').width - 32; // Adjust for padding

  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#4CAF50',
    },
  };

  const workoutCompletionData = {
    labels,
    datasets: [
      {
        data: completedData,
        color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
        strokeWidth: 2,
      },
      {
        data: totalData,
        color: (opacity = 1) => `rgba(200, 200, 200, ${opacity})`,
        strokeWidth: 2,
      },
    ],
    legend: ['Completed', 'Total'],
  };

  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Workout Completion</Text>
        <LineChart
          data={workoutCompletionData}
          width={screenWidth}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  chartContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});

export default WeeklySummaryChart;
