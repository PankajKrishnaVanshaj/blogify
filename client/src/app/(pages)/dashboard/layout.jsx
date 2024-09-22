import { useAuth } from "@/context/AuthContext";
import Header from "./_components/Header";
import Sidebar from "./_components/Sidebar";

const DashboardLayout = ({ children }) => {
  return (
    <div className="h-full flex flex-col">
      <Header />
      <div className="flex flex-grow">
        {/* Sidebar */}
        <div className=" ">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-grow p-4">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
