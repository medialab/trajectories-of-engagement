
import {
  NavLink
} from "react-router-dom";

export default function TrajectoryCard({
  data,
  onDelete,
  onChangePassword
}) {
  const handleGlobalClick = e => {
    e.stopPropagation();
  }
  return (
    <li className="TrajectoryCard" onClick={handleGlobalClick}>
      <div className="main-container">
        <h4 className="trajectory-title">
          <NavLink
            to={`/trajectories/${data?.id}`}
          >
            {data?.part1_general?.name}
          </NavLink>
        </h4>

        <ul className="info-container">
          <li>
            Création le {new Date(data.date_created).toLocaleDateString()} à {new Date(data.date_created).toLocaleTimeString()}
          </li>
          <li>
            Dernière édition le {new Date(data.date_edited).toLocaleDateString()} à {new Date(data.date_edited).toLocaleTimeString()}
          </li>
        </ul>
      </div>


      <ul className="actions-container">
        <li>
          <NavLink
            to={`/trajectories/${data?.id}`}
            className="button link"
          >
            ✎ Éditer la trajectoire
          </NavLink>
        </li>
        <li>
          <button onClick={onChangePassword}>
            🔒 Changer le mot de passe
          </button>
        </li>
        <li>
          <button onClick={onDelete}>
            ❌ Supprimer la trajectoire
          </button>
        </li>
      </ul>
    </li>
  )
}