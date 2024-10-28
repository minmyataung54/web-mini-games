import Loadable from "../../components/common/Loadable";
import { lazy } from "react";
import { PageEndPoint } from "../PageEndPoint";

const CatchIngridientsHOC = Loadable(lazy(() => import("../../pages/catchIngridients/index")));
const catchBottlesHOC = Loadable(
  lazy(() => import("../../pages/catchBottles/index")),
);

export default {
  routes: [
    { path: PageEndPoint.catchIngridients, component: CatchIngridientsHOC },
    {
      path: PageEndPoint.catchBottles,
      component: catchBottlesHOC,
    },
  ],
};
