/* eslint react/prefer-stateless-function: 0 */

import React from 'react';
import Head from 'next/head';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';

import withAuth from '../lib/withAuth';
import withLayout from '../lib/withLayout';

class Index extends React.Component {
  render() {
    return (
      <div style={{ padding: '30px 70px' }}>
        <Head>
          <title>Dashboard</title>
          <meta name="description" content="description" />
        </Head>
        <Grid container spacing={24}>
          <Grid item xs={12}>
            <Typography variant="headline">
              Dashboard
            </Typography>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withAuth(withLayout(Index));
