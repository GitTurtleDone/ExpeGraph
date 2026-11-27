import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AppShell from './components/shared/AppShell'
import DashboardPage from './pages/DashboardPage'
import AcquirePage from './pages/AcquirePage/AcquirePage'
import EquipmentPage from './pages/EquipmentPage'
import BatchesPage from './pages/BatchesPage'
import SamplesPage from './pages/SamplesPage'
import FilesPage from './pages/FilesPage'
import GraphsPage from './pages/GraphsPage'
import ExportPage from './pages/ExportPage'
import DatabaseSettingsPage from './pages/DatabaseSettingsPage'
import UsersPage from './pages/UsersPage'
import LabsPage from './pages/LabsPage'
import ProjectsPage from './pages/ProjectsPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'acquire', element: <AcquirePage /> },
      { path: 'equipment', element: <EquipmentPage /> },
      { path: 'batches', element: <BatchesPage /> },
      { path: 'samples', element: <SamplesPage /> },
      { path: 'files', element: <FilesPage /> },
      { path: 'graphs', element: <GraphsPage /> },
      { path: 'export', element: <ExportPage /> },
      { path: 'database', element: <DatabaseSettingsPage /> },
      { path: 'users', element: <UsersPage /> },
      { path: 'labs', element: <LabsPage />},
      { path: 'projects', element: <ProjectsPage />},
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}