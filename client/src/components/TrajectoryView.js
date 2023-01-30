import { useParams } from "react-router-dom"
import { useEffect, useState } from 'react';
// https://react-hook-form.com/get-started
import { useForm } from "react-hook-form";
import { toast } from 'react-toastify';

import { getTrajectory, updateTrajectory } from "../client";
import { useAuth } from "../utils";

export default function TrajectoryView() {
  const { id } = useParams();
  const {password} = useAuth();

  console.log('in trajectory view', id);

  const [trajectory, setTrajectory] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState('pending');
  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm();
 
  const refreshTrajectory = () => {
    setLoadingStatus('pending');
    const pm = new Promise((resolve, reject) => {
      getTrajectory(id, password)
      .then(res => {
        setLoadingStatus('success');
        setTrajectory(res?.data);
      })
      .catch(err => {
        console.error(err);
        setLoadingStatus('error');
        reject();
      })
      .then(resolve);
    })
    toast.promise(pm, {
      pending: 'Refreshing trajectory',
      success: 'Trajectory up to date',
      error: 'Error during trajectory refresh'
    })
  }
  
  const onSubmit = data => {
    const pm = new Promise((resolve, reject) => {
      const updatedTrajectory = {
        ...trajectory,
        ...data,
        date_updated: new Date()
      }
      setLoadingStatus('pending');
      updateTrajectory(updatedTrajectory, password)
      .then(refreshTrajectory)
      .then(resolve)
      .catch((err) => {
        console.error(err);
        reject();
        return refreshTrajectory();
      })
    })
    toast.promise(pm, {
      pending: 'Updating trajectory',
      success: 'Success updating trajectory',
      error: 'Error updating trajectory'
    })
  }

  const currentValues = watch();
  const isChanged = JSON.stringify({...trajectory, ...currentValues}) !== JSON.stringify(trajectory)

  useEffect(refreshTrajectory, [id, password]);

  const handleDiscardChanges = (e) => {
    e.preventDefault();
    e.stopPropagation();
    reset();
    toast.success('Form reset successfully !')
  }

  return (
    <div>
      This is a trajectory form for id <code>{id}</code>
      {
        loadingStatus === 'pending' ?
          <div>Loading</div> : null
      }
      {
        loadingStatus === 'error' ?
          <div>Error</div> : null
      }
      {
        loadingStatus === 'success' ?
          <form onSubmit={handleSubmit(onSubmit)}>
            <input defaultValue={trajectory.part1_general.name} {...register("part1_general.name")} />
            {
              errors.length ?
                <pre>
                  <code>
                    {JSON.stringify(errors)}
                  </code>
                </pre>
                : null
            }
            <footer>
              <button disabled={!isChanged} type="submit">Save changes</button>
              <button onClick={handleDiscardChanges} disabled={!isChanged}>Discard changes</button>
            </footer>
          </form>
          : null
      }

    </div>
  )
}