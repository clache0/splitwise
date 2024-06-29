import "../../styles/components/layout/Navbar.css"
import { Link } from "react-router-dom"

const Navbar = () => {
  return (
    <nav className="navbar">

      <Link className="nav-title nav-link" to="/">Splitwise</Link>

      <ul className="nav-ul">

        <li className="nav-li">
          <Link className="nav-link" to="/users">Users</Link>
        </li>
        {/* <li className="nav-li">
          <Link className="nav-link" to="/under-construction">Link 2</Link>
        </li>
        <li className="nav-li">
          <Link className="nav-link" to="/under-construction">Link 3</Link>
        </li> */}

      </ul>

    </nav>
  )
}
export default Navbar;