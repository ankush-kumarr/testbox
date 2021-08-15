import { useMemo } from "react";
import { Bar } from "react-chartjs-2";

// const data: { labels: any[]; datasets: any[] } = ;

const options = {
  indexAxis: "y",
  // Elements options apply to all of the options unless overridden in a dataset
  // In this case, we are setting the border of each horizontal bar to be 2px wide
  elements: {
    bar: {
      borderWidth: 0,
    },
  },
  responsive: true,
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
    },
  },
  plugins: {
    legend: {
      position: "bottom",
    },
    tooltip: {
      mode: "index",
      intersect: true,
      position: "nearest",
    },
  },
  maintainAspectRatio: false,
};

const HorizontalBarChart = ({ dataForChart }: any) => {
  const renderStyle = (label: number) => {
    const height = 50 + label * 40;
    return {
      width: "100%",
      height: `${height}px`,
    };
  };

  const BarChart = useMemo(() => {
    return <Bar data={dataForChart} options={options} type="horizontalBar" />;
  }, [dataForChart]);
  return (
    <>
      <div
        style={renderStyle(dataForChart?.labels?.length)}>{BarChart}</div>
    </>
  );
};

export default HorizontalBarChart;
