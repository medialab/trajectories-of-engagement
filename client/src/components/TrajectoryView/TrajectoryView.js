import { useParams, useSearchParams } from "react-router-dom"
import { useEffect, useState, useMemo } from 'react';
// https://react-hook-form.com/get-started
import { useForm } from "react-hook-form";
import { toast } from 'react-toastify';

import { getTrajectory, updateTrajectory } from "../../client";
import { useAuth } from "../../utils";
import GeneralInformation from "./GeneralInformation";

export default function TrajectoryView() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const {password} = useAuth();
  const [trajectory, setTrajectory] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState('pending');
  let lang = useMemo(() => {
    return searchParams && searchParams.get('lang');
  }, [searchParams]);
  lang = lang || 'en';
  
  const { 
    register, 
    handleSubmit, 
    watch, 
    control,
    getValues,
    setValue,
    formState: { errors }, reset 
  } = useForm();
 
  const refreshTrajectory = () => {
    setLoadingStatus('pending');
    const pm = new Promise((resolve, reject) => {
      getTrajectory(id, password)
      .then(res => {
        setLoadingStatus('success');
        setTrajectory(res?.data);
        // @todo this is ugly but working, refacto someday
        const newData = res?.data || {};
        for (let key in newData) {
          setValue(key, newData[key])
        }
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
      // console.log('updatedTrajectory', updatedTrajectory);
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
    <div className="TrajectoryView">
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
            <GeneralInformation
              {...{
                trajectory,
                register,
                control,
                getValues,
                setValue,
                lang,
              }}
            />
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