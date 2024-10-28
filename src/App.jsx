import { BrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import AuthRoutes from './ecosystem/AuthRoutes';


function App() {

  return (
    <RecoilRoot>
        <BrowserRouter>
          <AuthRoutes />
        </BrowserRouter>
    </RecoilRoot>
  )
}

export default App
