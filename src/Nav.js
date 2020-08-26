import React from "react";
import { NavLink } from "react-router-dom";

export default function Nav() {
  return (
    <ul className="nav">
      <li>
        <NavLink className="nav-link" activeClassName="active-tab" to="/items">
          Items
        </NavLink>
      </li>
      <li>
        <NavLink className="nav-link" activeClassName="active-tab" to="/cart">
          Cart
        </NavLink>
      </li>
    </ul>
  );
}
