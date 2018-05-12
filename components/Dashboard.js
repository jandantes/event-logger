import React from 'react';
import NProgress from 'nprogress';
import { Bar } from 'react-chartjs-2';
import { getDashboardMain } from '../lib/api/dashboard';
import notify from '../lib/notifier';

const options = {
  maintainAspectRatio: false,
};

class DashboardMain extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {},
    };
  }

  async componentDidMount() {
    NProgress.start();
    try {
      const res = await getDashboardMain();
      this.setState({ // eslint-disable-line
        data: {
          labels: [...res].map(doc => doc.date),
          datasets: [
            {
              label: 'Events',
              backgroundColor: 'rgba(80,80,80,0.2)',
              borderColor: 'rgba(80,80,80,0.4)',
              borderWidth: 1,
              data: [...res].map(doc => doc.count),
            },
          ],
        },
      });
      NProgress.done();
    } catch (err) {
      NProgress.done();
      notify(err);
    }
  }

  render() {
    return (
      <div>
        <Bar
          data={this.state.data}
          width={100}
          height={300}
          options={options}
        />
      </div>
    );
  }
}

export default DashboardMain;
