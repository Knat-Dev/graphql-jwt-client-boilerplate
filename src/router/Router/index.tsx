import { BrowserRouter, Switch } from 'react-router-dom';
import { Index, Login, Register } from '../../pages';
import { PrivateRoute, PublicRoute } from '../utils';

function Router() {
  return (
    <BrowserRouter>
      <Switch>
        <PrivateRoute exact path="/" component={Index} />
        <PublicRoute exact path="/login" component={Login} />
        <PublicRoute exact path="/register" component={Register} />
      </Switch>
    </BrowserRouter>
  );
}

export default Router;
