import React from "react";
import { Routes, Route } from "react-router-dom";

import { publicRoutes, privateRoutes } from "../router/Router"; 
import ProtectedRoute from "../components/ProtectedRoutes/ProtectedRoute"; 

const AppRouter = () => {
  return (
    <Routes>
      {publicRoutes.map((route) => (
        <Route
          path={route.path}
          Component={route.component}
          exact={route.exact}
          key={route.path}
        />
      ))}

      <Route element={<ProtectedRoute />}>
        {privateRoutes.map((route) => (
          <Route
            path={route.path}
            Component={route.component}
            exact={route.exact}
            key={route.path}
          />
        ))}
      </Route>
    </Routes>
  );
};

export default AppRouter;
