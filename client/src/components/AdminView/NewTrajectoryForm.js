import { useForm } from "react-hook-form";

export default function NewTrajectoryForm({
  onSubmit,
  onCancel
}) {
  const { register, handleSubmit, } = useForm();
  const handleGlobalClick = (e) => {
    e.stopPropagation();
  }
  return (
    <form onClick={handleGlobalClick} className="NewTrajectoryForm" onSubmit={handleSubmit(onSubmit)}>
      <h2>Créer une nouvelle trajectoire</h2>
      <ul className="inputs-container">
        <li>
          <label>Titre de la trajectoire</label>
          <div>
          <input placeholder="titre de la trajectoire" {...register("part1_general.name", { required: true })} />
          </div>
        </li>
        <li>
          <label>Mot de passe spécifique à la trajectoire </label>
          <div>
          <input placeholder="mot de passe" {...register("password", { required: true })} />
          </div>
        </li>
      </ul>
      <ul className="actions-container">
        <li>
        <button type="submit">
          Créer la nouvelle trajectoire
        </button>
        </li>
        <li>
        <button onClick={onCancel}>
          Annuler
        </button>
        </li>
      </ul>
    </form>
  )
}