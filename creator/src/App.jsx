import { lazy, Suspense } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

// Lazy load your page components
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Contents = lazy(() => import("./pages/Contents"));
const WritePost = lazy(() => import("./pages/WritePost"));
const Home = lazy(() => import("./pages/Home"));
const Settings = lazy(() => import("./pages/Settings"));
const Users = lazy(() => import("./pages/Users"));

function Layout() {
  return (
    <div className="w-full h-screen flex flex-col">
      <Navbar />
      <div className="w-full h-full flex border-t pt-16">
        <aside className="w-64 hidden lg:flex mt-[-3rem]">
          <Sidebar />
        </aside>
        <main className="w-full flex-1 px-1 py-4 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <main className="w-full min-h-screen">
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route element={<Layout />}>
            <Route index path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/users" element={<Users />} />
            <Route path="/contents" element={<Contents />} />
            <Route path="/create-post/:postId?" element={<WritePost />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          <Route path="/auth" element={<Home />} />
        </Routes>
      </Suspense>
    </main>
  );
}

export default App;
