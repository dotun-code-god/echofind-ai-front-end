import { BrowserRouter, Route, Routes } from "react-router"
import Home from "./pages/home";
import SignUp from "./pages/sign-up";
import Login from "./pages/login";
import Upload from "./pages/upload";
import ProtectedRoute from "./wrappers/protected";
import PublicRoute from "./wrappers/public";
import Audio from "./pages/audio";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Protected Routes */}
        <Route 
          path="/upload" 
          element={<ProtectedRoute><Upload /></ProtectedRoute>} 
        />
        
        <Route 
          path="/audio/:id" 
          element={<ProtectedRoute><Audio /></ProtectedRoute>} 
        />

        {/* Auth Routes */}
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App;