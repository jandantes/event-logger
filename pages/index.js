/* eslint react/prefer-stateless-function: 0 */

import React from 'react';
import Head from 'next/head';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';

import withAuth from '../lib/withAuth';
import withLayout from '../lib/withLayout';
import DashboardMain from '../components/Dashboard';

class Index extends React.Component {
  render() {
    return (
      <div style={{ padding: '30px 5%' }}>
        <Head>
          <title>AE - Dashboard</title>
          <meta name="description" content="description" />
        </Head>
        <Grid item xs={12}>
          <Typography variant="headline">
            Dashboard
          </Typography>
        </Grid>
        <DashboardMain />
      </div>
    );
  }
}

export default withAuth(withLayout(Index));
