import Head from 'next/head';
import Card, { CardContent } from 'material-ui/Card';
import Button from 'material-ui/Button';
import Avatar from 'material-ui/Avatar';

import withAuth from '../lib/withAuth';
import withLayout from '../lib/withLayout';
import { styleLoginButton } from '../components/SharedStyles';

const Login = () => (
  <div style={{ textAlign: 'center' }}>
    <Head>
      <title>AE - Login</title>
      <meta name="description" content="Login page" />
    </Head>
    <div id="login">
      <Card style={{ width: '250px', margin: '10% auto' }}>
        <CardContent>
          <Avatar
            src="/static/images/logo.png"
            alt="Altitude Events Logo"
            style={{ margin: '10px auto 30px' }}
          />
          <p><small>You’ll be logged in for 3 days unless you log out manually.</small></p>
          <br />
          <Button variant="raised" style={styleLoginButton} href="/auth/google">
            <img
              src="/static/images/G.svg"
              alt="Log in with Google"
            />
            &nbsp;&nbsp;&nbsp; Log in with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default withAuth(withLayout(Login), { logoutRequired: true });
