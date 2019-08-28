// For wrapping on export, provides context
import { withContext } from "../helpers/context";

const UserSignOut = props => {
  // 'Redirect' is returned from onSignOut and has to be returned to render.
  return props.context.onSignOut();
};

// Wrapper provides context
export default withContext(UserSignOut);
