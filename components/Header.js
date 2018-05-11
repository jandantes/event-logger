import PropTypes from 'prop-types';
import Link from 'next/link';
import Router from 'next/router';
import NProgress from 'nprogress';
import Toolbar from 'material-ui/Toolbar';
import Grid from 'material-ui/Grid';
import Avatar from 'material-ui/Avatar';

import MenuDrop from './MenuDrop';

import { styleToolbar } from './SharedStyles';

Router.onRouteChangeStart = () => {
  NProgress.start();
};
Router.onRouteChangeComplete = () => NProgress.done();
Router.onRouteChangeError = () => NProgress.done();

const optionsMenu = [
  {
    text: 'Admin',
    href: '/admin',
  },
  {
    text: 'Log out',
    href: '/logout',
  },
];

function Header({ user }) {
  return (
    <div>
      {user ? (
        <Toolbar style={styleToolbar}>
          <Grid container direction="row" justify="space-around" alignItems="center">
            <Grid item sm={10} xs={9} style={{ textAlign: 'left' }}>
              <Link prefetch href="/">
                <a>
                  <Avatar
                    src="/static/images/logo.png"
                    alt="Logo"
                    style={{ margin: '0px auto 0px 20px' }}
                  />
                </a>
              </Link>
            </Grid>
            <Grid item sm={1} xs={3} style={{ textAlign: 'right' }}>
              <div style={{ whiteSpace: ' nowrap' }}>
                {user.avatarUrl ? (
                  <MenuDrop options={optionsMenu} src={user.avatarUrl} alt="Avatar" />
                ) : null}
              </div>
            </Grid>
          </Grid>
        </Toolbar>
      ) : null}
    </div>
  );
}

Header.propTypes = {
  user: PropTypes.shape({
    avatarUrl: PropTypes.string,
    email: PropTypes.string.isRequired,
  }),
};

Header.defaultProps = {
  user: null,
};

export default Header;
