import React from 'react';
import NProgress from 'nprogress';
import { Bar } from 'react-chartjs-2';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Icon from 'material-ui/Icon';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import DateFnsUtils from 'material-ui-pickers/utils/date-fns-utils';
import DateTimePicker from 'material-ui-pickers/DateTimePicker';

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
      filter: {
        key: '',
        start: null,
        end: null,
      },
    };

    this.baseState = this.state;
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = async (filter) => {
    NProgress.start();
    try {
      const res = await getDashboardMain(filter);
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
      if (!res.length) notify('No data');
      NProgress.done();
    } catch (err) {
      NProgress.done();
      notify(err);
    }
  };

  search = () => {
    this.fetchData(this.state.filter);
  }

  reset = () => {
    this.setState(this.baseState);
    this.fetchData();
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
              data={this.state.data}
              width={100}
              height={300}
              options={options}
            />
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default DashboardMain;
