import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./routes/Home";
import Game from "./routes/Game";

const AuthRoutes = () => {
  return (
    <Routes>
      {[
        Home.routes,
        Game.routes
      ]
        .flat()
        .map((entry, index) => (
          <Route
            key={index}
            path={entry.path.url}
            element={<entry.component />}
          />
        ))}
      <Route path="/*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AuthRoutes;
