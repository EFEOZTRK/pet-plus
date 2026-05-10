
function VetPanel() {
    import AuthContext from "../context/AuthContext"
    import { useContext } from "react"

    const {user} = useContext(AuthContext);

  
    return (
    <div>VetPanel</div>


  )
}

export default VetPanel