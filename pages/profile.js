/* eslint react/prefer-stateless-function: 0 */
import PropTypes from 'prop-types';
import React from 'react';
import Head from 'next/head';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import List, { ListItem, ListItemText } from 'material-ui/List';

import withAuth from '../lib/withAuth';
import withLayout from '../lib/withLayout';
import { styleWrapText } from '../components/SharedStyles';

const ProfileDetails = ({ user }) => (
  <div style={{ padding: '30px 5%' }}>
    <Head>
      <title>AE - Profile</title>
      <meta name="description" content="description" />
    </Head>
    <Grid container spacing={24}>
      <Grid item xs={12}>
        <Typography variant="headline">
          Profile
        </Typography>
        <Grid item xs={6}>
          <Paper style={{ marginTop: 20 }} elevation={1}>
            <List>
              <ListItem>
                <ListItemText primary="Display Name" secondary={user.displayName} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Email" secondary={user.email} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Access Token" secondary={user.token} style={styleWrapText} />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Grid>
  </div>
);

class Profile extends React.Component {
  render() {
    return <ProfileDetails {...this.props} {...this.state} />;
  }
}

ProfileDetails.propTypes = {
  user: PropTypes.shape({
    token: PropTypes.string,
    email: PropTypes.string,
    displayName: PropTypes.string,
  }),
};

ProfileDetails.defaultProps = {
  user: null,
};

export default withAuth(withLayout(Profile));
