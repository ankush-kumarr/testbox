import React from "react";
import { Bar } from "react-chartjs-2";

// const data = {
//   labels: ["1", "2", "3", "4", "5", "6", "7"],
//   datasets: [
//     {
//       label: "# of Fails cases",
//       data: [12, 19, 3, 5, 2, 3],
//       backgroundColor: "rgb(255, 99, 132)",
//     },
//     {
//       label: "# of Blocked cases",
//       data: [2, 3, 20, 5, 1, 4],
//       backgroundColor: "rgb(54, 162, 235)",
//     },
//     {
//       label: "# of Pass cases",
//       data: [3, 10, 13, 15, 22, 30],
//       backgroundColor: "rgb(75, 192, 192)",
//     },
//   ],
// };

const options = {
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
        },
      },
    ],
  },
  maintainAspectRatio: false,
};

const GroupedBar = (props: any) => (
  <>
    {/* <div className="header">
      <h1 className="title">Grouped Bar Chart</h1>
    </div> */}
    <Bar type="bar" data={props.dataset} options={options} />
  </>
);

export default GroupedBar;
