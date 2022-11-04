import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useForm } from "react-hook-form";

import { toast } from 'react-toastify';

import {v4 as genId} from 'uuid';

import { deleteTrajectory, getTrajectories, createTrajectory, updateTrajectoryPassword } from "../client";
import { useAuth } from '../utils';

const isPasswordValid = pwd => {
  return pwd !== null 
  && pwd.length > 2;
}

const NewTrajectoryForm = ({
  onSubmit,
  onCancel
}) => {
  const { register, handleSubmit, } = useForm();
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Name: </label>
        <input placeholder="name" {...register("part1_general.name", { required: true })} />
      </div>
      <div>
        <label>Trajectory-specific password: </label>
        <input placeholder="password" {...register("password", { required: true })} />
      </div>
      <div>
        <button type="submit">Create new trajectory</button>
      <button onClick={onCancel}>
        Cancel
      </button>
      </div>
    </form>
  )
}

export default function AdminView ({lang}) {

  const { password } = useAuth();
  const [trajectories, setTrajectories] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState('pending');
  const [newTrajectoryPrompted, setNewTrajectoryPrompted] = useState(false);

  const refreshTrajectories = () => {
    setLoadingStatus('pending');
    const pm = new Promise((resolve, reject) => {
      getTrajectories(password)
      .then(res => {
        setLoadingStatus('success');
        setTrajectories(res);
        resolve();
      })
      .catch(err => {
        console.error(err);
        setLoadingStatus('error');
        reject();
      })
    })
    toast.promise(pm, {
      pending: 'loading trajectories',
      success: 'trajectories loaded successfully',
      error: 'could not load trajectories'
    })
  }
  useEffect(refreshTrajectories, [password]);

  const handlePromptNewTrajectory = () => {
    setNewTrajectoryPrompted(true);
  }
  const handleCreateNewTrajectory = trajectory => {
    setNewTrajectoryPrompted(false);
    setLoadingStatus('pending');
    const createTrajectoryPm = new Promise((resolve, reject) => {
      createTrajectory({
        ...trajectory,
        // lang: 'fr',
        date_created: new Date(),
        date_edited: new Date(),
        id: genId()
      }, password)
      .then(refreshTrajectories)
      .then(resolve)
      .catch(reject)
    })
    toast.promise(createTrajectoryPm, {
      pending: `creating trajectory "${trajectory?.part1_general?.name}"`,
      success: `successfully created trajectory "${trajectory?.part1_general?.name}"`,
      error: `an error occured creating trajectory "${trajectory?.part1_general?.name}"`
    })
  }

  return (
    <div className="AdminView">
      {
        loadingStatus === 'pending' ?
        <div>Loading</div>: null
      }
      {
        loadingStatus === 'error' ?
        <div>Error</div>: null
      }
      {
        loadingStatus === 'success'
        ?
        <>
        <h2>Trajectories list</h2>
        <ul>
          {
            trajectories.map(({_id, data}) => {

              const handleDelete = () => {
                if (window.confirm(`Are you sure you want to delete the trajectory "${data?.part1_general?.name}"`)) {
                  const deleteTrajectoryPm = new Promise((resolve, reject) => {
                    deleteTrajectory(data?.id, password)
                    .then(refreshTrajectories)
                    .then(resolve)
                    .catch(reject)
                  })
                  toast.promise(deleteTrajectoryPm, {
                    pending: `Deleting trajectory "${data?.part1_general?.name}"`,
                    success: `Successfully deleted trajectory "${data?.part1_general?.name}"`,
                    error: `Could not delete trajectory "${data?.part1_general?.name}"`,
                  })
                }
              }

              const handleChangePassword = () => {
                const newPassword = prompt("Please enter a new password", "");
                if (isPasswordValid(newPassword)) {
                  const changePasswordPm = new Promise((resolve, reject) => {
                    updateTrajectoryPassword(data?.id, newPassword, password)
                    .then(refreshTrajectories)
                    .then(resolve)
                    .catch(reject)
                  })
                  toast.promise(changePasswordPm, {
                    pending: `Changing password for trajectory "${data?.part1_general?.name}"`,
                    success: `Successfully changed password for trajectory "${data?.part1_general?.name}"`,
                    error: `Could not change password for trajectory "${data?.part1_general?.name}"`,
                  })
                }
              }
              return (
                <li key={_id}>
                  <h4>
                    {data?.part1_general?.name}
                  </h4>
                  <div>
                    <NavLink
                      to={`/trajectories/${data?.id}`}
                    >
                      Edit trajectory form
                    </NavLink>
                  </div>
                  <pre>
                    <code>
                      {JSON.stringify(data)}
                    </code>
                  </pre>

                  <ul>
                    <li>
                      <button onClick={handleChangePassword}>
                        Change password
                      </button>
                    </li>
                    <li>
                      <button onClick={handleDelete}>
                        Delete trajectory
                      </button>
                    </li>
                  </ul>
                </li>
              )
            })
          }
        </ul>
        <button onClick={handlePromptNewTrajectory}>
          Create new trajectory
        </button>
        </>
        : null
      }
      {
        newTrajectoryPrompted ?
        <NewTrajectoryForm
          onSubmit={handleCreateNewTrajectory}
          onCancel={() => setNewTrajectoryPrompted(false)}
        />
        :
        null
      }
    </div>
  )
}