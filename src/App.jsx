import { Route, Routes } from "react-router-dom";
import "./locales";
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import TrendingPage from "./pages/TrendingPage";
import UpcomingPage from "./pages/UpcomingPage";
import Cart from "./components/cart/Cart";
import TopRatedPage from "./pages/TopRatedPage";
import MainLayout from "./layout/MainLayout";

const App = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <MainLayout>
            <HomePage />
          </MainLayout>
        }
      />
      <Route
        path="/search/:query"
        element={
          <MainLayout>
            <SearchPage />
          </MainLayout>
        }
      />
      <Route
        path="/trending"
        element={
          <MainLayout>
            <TrendingPage />
          </MainLayout>
        }
      />
      <Route
        path="/top-rated"
        element={
          <MainLayout>
            <TopRatedPage />
          </MainLayout>
        }
      />
      <Route
        path="/upcoming"
        element={
          <MainLayout>
            <UpcomingPage />
          </MainLayout>
        }
      />
      <Route
        path="/cart"
        element={
          <MainLayout>
            <Cart />
          </MainLayout>
        }
      />
    </Routes>
  );
};
export default App;
