import { lazy } from "react";
import { PageEndPoint } from "../PageEndPoint";
import Loadable from "../../components/common/Loadable";

const HomeHOC = Loadable(lazy(() => import("../../pages/Home")));

export default {
  routes: [{ path: PageEndPoint.home, component: HomeHOC }],
};
