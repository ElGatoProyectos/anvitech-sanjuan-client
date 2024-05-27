import Header from "@/components/aplication/header";
import Sidebar from "@/components/aplication/sidebar";
import { Toaster } from "@/components/ui/toaster";
import "../globals.css";

function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="min-h-screen flex flex-row bg-slate-100 text-gray-800">
        <Sidebar></Sidebar>
        <main className="flex flex-col w-full  ml-64 ">
          <Header></Header>
          <div className="flex w-full px-8 py-8 ">{children}</div>
        </main>
      </div>
      <Toaster />
    </>
  );
}

export default Layout;
