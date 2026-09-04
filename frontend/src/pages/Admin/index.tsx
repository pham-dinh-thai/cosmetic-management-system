import Header from '../../components/Header';

const Admin: React.FC = () => {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans antialiased flex flex-col">
      <Header roleTitle="Admin" />
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="mt-2 text-sm text-zinc-500">Trang quản trị Guardian</p>
        </div>
      </main>
    </div>
  );
};

export default Admin;
