import React from 'react'
import { BrowserRouter as Router, Routes, Route }
  from "react-router-dom"
import SignUp from './pages/Auth/SignUp'
import SignIn from './pages/Auth/SignIn'


const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/signIn" element={<SignIn />}>
            <Route path="/signUp" element={<SignUp />}>
            </Route>
          </Route>
        </Routes>
      </Router>
    </div>
  )
}

export default App