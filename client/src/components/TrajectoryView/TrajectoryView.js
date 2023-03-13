import { useParams, useSearchParams } from "react-router-dom"
import { useEffect, useState, useMemo } from 'react';
// import cx from 'classnames';
// https://react-hook-form.com/get-started
import { useForm } from "react-hook-form";
import { toast } from 'react-toastify';

import { translate } from "../../utils";
import { getTrajectory, updateTrajectory } from "../../client";
import { useAuth } from "../../utils";
import GeneralInformation from "./GeneralInformation";

import './TrajectoryView.scss';
import ConclusionAndReflection from "./ConclusionAndReflection";
import Actors from "./Actors";
import Phases from "./Phases";
import PhasesEditor from "./PhasesEditor";

export default function TrajectoryView() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { password } = useAuth();
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
  const isChanged = JSON.stringify({ ...trajectory, ...currentValues }) !== JSON.stringify(trajectory)

  useEffect(refreshTrajectory, [id, password]);

  const handleDiscardChanges = (e) => {
    e.preventDefault();
    e.stopPropagation();
    reset();
    toast.success('Form reset successfully !')
  }

  return (
    <div className="TrajectoryView">
      <header>
        <h1>
          {translate('you_are_editing', lang)}
          {' '}
          {getValues('trajectory_name') || translate('unknown_trajectory', lang)}
        </h1>
        <h2>{translate('site_title', lang)}</h2>
      </header>
      {
        loadingStatus === 'pending' ?
          <div className="temp"><div>{translate('loading', lang)}</div></div> : null
      }
      {
        loadingStatus === 'error' ?
          <div className="temp"><div>Error, reload</div></div> : null
      }
      {
        loadingStatus === 'success' ?
          <main>
            <form onSubmit={handleSubmit(onSubmit)}>
              <GeneralInformation
                {...{
                  trajectory: currentValues,
                  register,
                  control,
                  getValues,
                  setValue,
                  lang,
                }}
              />
              <Actors
                {...{
                  trajectory: currentValues,
                  register,
                  control,
                  getValues,
                  setValue,
                  lang,
                }}
              />
              <Phases
                {...{
                  trajectory: currentValues,
                  register,
                  control,
                  getValues,
                  setValue,
                  lang,
                }}
              />
              <PhasesEditor
                {...{
                  trajectory: currentValues,
                  register,
                  control,
                  getValues,
                  setValue,
                  lang,
                }}
              />
              <ConclusionAndReflection
                {...{
                  trajectory: currentValues,
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
                <div className="left-group">
                  <button disabled={!isChanged} type="submit">
                    {translate('save_changes', lang)}
                  </button>
                  <button
                    onClick={handleDiscardChanges}
                    disabled={!isChanged}
                  >
                    {translate('discard_changes', lang)}
                  </button>
                </div>
                <div className="right-group">
                  <button disabled={lang === 'fr'} onClick={() => setSearchParams({ lang: 'fr' })}>fr</button>
                  <button disabled={lang === 'en'} onClick={() => setSearchParams({ lang: 'en' })}>en</button>
                </div>
              </footer>
            </form>
          </main>
          : null
      }

    </div>
  )
}