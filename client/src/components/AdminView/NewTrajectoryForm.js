import { useForm } from "react-hook-form";
import {useRef, useEffect} from 'react';

export default function NewTrajectoryForm({
  onSubmit,
  onCancel
}) {
  const { register, handleSubmit, } = useForm();
  const handleGlobalClick = (e) => {
    e.stopPropagation();
  }
  const firstInputRef = useRef();
  useEffect(() => {
    if (firstInputRef.current) {
      firstInputRef.current.querySelector('input').focus();
    }
  }, [])
  return (
    <form onClick={handleGlobalClick} className="NewTrajectoryForm" onSubmit={handleSubmit(onSubmit)}>
      <h2>Créer une nouvelle trajectoire</h2>
      <ul className="inputs-container">
        <li>
          <label>Titre de la trajectoire</label>
          <div ref={firstInputRef}>
            <input placeholder="titre de la trajectoire" {...register("trajectory_name", { required: true })} />
          </div>
        </li>
        <li>
          <label>Mot de passe spécifique à la trajectoire <strong>(notez-le bien ! il ne sera affiché qu'à cette étape)</strong> </label>
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