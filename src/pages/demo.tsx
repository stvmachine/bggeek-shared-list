import React from "react";
import {
  useAuthUser,
  withAuthUser,
  withAuthUserTokenSSR,
  AuthAction,
} from "next-firebase-auth";

// const Demo = () => {
//   const AuthUser = useAuthUser();
//   return (
//     <div>
//       <p>Your email is {AuthUser.email ? AuthUser.email : "unknown"}.</p>
//     </div>
//   );
// };

// // Note that this is a higher-order function.
// export const getServerSideProps = withAuthUserTokenSSR()();

// export default withAuthUser()(Demo);


const DemoPage = () => <div>My demo page</div>

export default withAuthUser({
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  authPageURL: '/login/'
})(DemoPage)

