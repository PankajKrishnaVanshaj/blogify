import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Followers from "./pages/Followers";
import Contents from "./pages/Contents";
import WritePost from "./pages/WritePost";
import Home from "./pages/Home";
import Settings from "./pages/Settings";

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
      <Routes>
        <Route element={<Layout />}>
          <Route index path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/followers" element={<Followers />} />
          <Route path="/contents" element={<Contents />} />
          <Route path="/create-post/:postId?" element={<WritePost />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        <Route path="/auth" element={<Home />} />
      </Routes>
    </main>
  );
}

export default App;
