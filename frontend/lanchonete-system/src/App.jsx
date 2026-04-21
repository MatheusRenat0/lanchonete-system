import { useEffect } from "react";
import api from "./services/api";

function App() {

  useEffect(() => {
    api.get("/teste")
      .then(res => console.log(res.data))
      .catch(err => console.log(err));
  }, []);

  return <h1>Lanchonete System</h1>
}

export default App;