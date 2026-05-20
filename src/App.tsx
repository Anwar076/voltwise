import { Routes, Route } from 'react-router'
import Layout from '@/components/Layout'
import Login from '@/pages/Login'
import Dashboard from '@/pages/Dashboard'
import Verbruikers from '@/pages/Verbruikers'
import Voorspelling from '@/pages/Voorspelling'
import Batterij from '@/pages/Batterij'
import Simulatie from '@/pages/Simulatie'
import Beheer from '@/pages/Beheer'
import Business from '@/pages/Business'
import Architectuur from '@/pages/Architectuur'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/verbruikers" element={<Verbruikers />} />
        <Route path="/voorspelling" element={<Voorspelling />} />
        <Route path="/batterij" element={<Batterij />} />
        <Route path="/simulatie" element={<Simulatie />} />
        <Route path="/beheer" element={<Beheer />} />
        <Route path="/business" element={<Business />} />
        <Route path="/architectuur" element={<Architectuur />} />
      </Route>
    </Routes>
  )
}
