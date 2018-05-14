import React from 'react';
import NProgress from 'nprogress';
import { Bar } from 'react-chartjs-2';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Icon from 'material-ui/Icon';
import Typography from 'material-ui/Typography';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import DateFnsUtils from 'material-ui-pickers/utils/date-fns-utils';
import DateTimePicker from 'material-ui-pickers/DateTimePicker';
import InfiniteScroll from 'react-infinite-scroll-component';

import { getDashboardMain, getDashboardList } from '../lib/api/dashboard';
import notify from '../lib/notifier';
import { styleWrapText } from '../lib/SharedStyles';

const options = {
  maintainAspectRatio: false,
  scales: {
    yAxes: [{
      display: true,
      ticks: {
        beginAtZero: true,
        fixedStepSize: 1,
      },
    }],
  },
};

function renderList(event) {
  return (
    <Grid container spacing={8} key={event.key}>
      <Grid item xs={3}>
        {event.timestamp}
      </Grid>
      <Grid item xs={9} style={styleWrapText}>
        {JSON.stringify(event)}
      </Grid>
    </Grid>
  );
}


class DashboardMain extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dashboard: {},
      list: [],
      count: 0,
      filter: {
        key: '',
        start: null,
        end: null,
      },
      hasMore: true,
    };

    this.baseState = this.state;
  }

  componentDidMount() {
    this.fetchDashboard();
    this.fetchList();
  }

  fetchDashboard = async (filter) => {
    NProgress.start();
    try {
      const dashboardData = await getDashboardMain(filter);
      this.setState({ // eslint-disable-line
        dashboard: {
          labels: [...dashboardData].map(doc => doc.date),
          datasets: [
            {
              label: 'Events',
              backgroundColor: 'rgba(80,80,80,0.2)',
              borderColor: 'rgba(80,80,80,0.4)',
              borderWidth: 1,
              data: [...dashboardData].map(doc => doc.count),
            },
          ],
        },
      });
      if (!dashboardData.length) notify('No data');
      NProgress.done();
    } catch (err) {
      NProgress.done();
      notify(err);
    }
  };

  fetchList = async (filter) => {
    try {
      const query = filter || {};
      query.skip = this.state.list.length || 0;
      const listData = await getDashboardList(query);
      const newList = [...this.state.list, ...listData.events];
      this.setState({ // eslint-disable-line
        list: newList,
        count: listData.count,
      });
      if (this.state.list.length >= this.state.count) {
        this.setState({ hasMore: false });
      }
      if (!listData.events.length) notify('No data');
      NProgress.done();
    } catch (err) {
      NProgress.done();
      notify(err);
    }
  };

  search = () => {
    this.fetchDashboard(this.state.filter);
    this.setState({
      list: [],
    }, () => this.fetchList(this.state.filter));
  }

  reset = () => {
    this.setState(this.baseState);
    this.fetchDashboard();
    this.setState({
      list: [],
    }, () => this.fetchList(this.state.filter));
  }

  render() {
    return (
      <div>
        <Grid
          container
          spacing={8}
          justify="flex-end"
        >
          <Grid item xs={3}>
            <TextField
              onChange={(event) => {
                this.setState({
                  filter: Object.assign({}, this.state.filter, {
                    key: event.target.value,
                  }),
                });
              }}
              value={this.state.filter.key}
              disabled={((this.state.filter.start || this.state.filter.end) !== null) || false}
              label="Key"
              type="text"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={2}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <DateTimePicker
                label="Start Time"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                disabled={(this.state.filter.key !== '') || false}
                value={this.state.filter.start}
                maxDate={this.state.filter.end ? this.state.filter.end : new Date()}
                onChange={(startDate) => {
                  this.setState({
                    filter: Object.assign({}, this.state.filter, {
                      start: startDate,
                    }),
                  });
                }}
              />
            </MuiPickersUtilsProvider>
          </Grid>
          <Grid item xs={2}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <DateTimePicker
                label="End Time"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                disabled={(this.state.filter.key !== '') || false}
                value={this.state.filter.end}
                minDate={this.state.filter.start ? this.state.filter.start : new Date()}
                onChange={(endDate) => {
                  this.setState({
                    filter: Object.assign({}, this.state.filter, {
                      end: endDate,
                    }),
                  });
                }}
              />
            </MuiPickersUtilsProvider>
          </Grid>
          <Grid item>
            <Button
              variant="fab"
              color="primary"
              onClick={this.search}
            >
              <Icon>search</Icon>
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="fab"
              onClick={this.reset}
            >
              <Icon>refresh</Icon>
            </Button>
          </Grid>
        </Grid>
        <Grid container spacing={24}>
          <Grid item xs={12}>
            <Bar
              data={this.state.dashboard}
              width={100}
              height={300}
              options={options}
            />
          </Grid>
        </Grid>
        <Grid container spacing={24}>
          <Grid item xs={12}>
            <Typography variant="headline">
              {this.state.count} event{this.state.count > 1 ? 's' : ''}
            </Typography>
            <InfiniteScroll
              style={{ 'overflow-x': 'hidden', 'font-family': 'monospace', 'font-size': '12px' }}
              dataLength={this.state.list.length}
              next={this.fetchList}
              hasMore={this.state.hasMore}
              height={300}
              loader={<h4>Loading...</h4>}
            >
              {this.state.list.map(event => renderList(event))}
            </InfiniteScroll>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default DashboardMain;
