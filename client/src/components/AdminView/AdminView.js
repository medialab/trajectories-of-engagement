import { useEffect, useState } from 'react';

import NewTrajectoryForm from './NewTrajectoryForm';

import {
  useParams,
  useNavigate,
  useLocation,
  NavLink,
} from "react-router-dom";

import { toast } from 'react-toastify';

import { v4 as genId } from 'uuid';

import { deleteTrajectory, getTrajectories, createTrajectory, updateTrajectoryPassword } from "../../client";
import { useAuth } from '../../utils';
import AuthStatus from '../AuthStatus';

import './AdminView.scss';
import TrajectoryCard from './TrajectoryCard';

const isPasswordValid = pwd => {
  return pwd !== null
    && pwd.length > 2;
}


export default function AdminView({ lang }) {

  const { password } = useAuth();
  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();
  const [trajectories, setTrajectories] = useState(null);
  const [searchStr, setSearchStr] = useState('');
  const [loadingStatus, setLoadingStatus] = useState(null);
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
          if (err?.response?.status === 403) {
            navigate("/login", {
              replace: true,
              state: {
                from: location,
                isAdmin: false,
                params
              }
            })
          }
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
  useEffect(refreshTrajectories, [password, location, navigate, params]);

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
          <div className="loading-container">Chargement</div> : null
      }
      {
        loadingStatus === 'error' ?
          <div className="error-container">Il y a une erreur - essaie de recharger la page ça devrait remarcher.</div> : null
      }
      {
        loadingStatus === 'success'
          ?
          <>
            <header>
              <h2><NavLink to="/">Trajectoires d'implication</NavLink> / admin</h2>
              <AuthStatus />
            </header>
            <div className="tools-row">
            <ul className="tools-container">
              <li className="search-container">
                <span>Rechercher une trajectoire</span>
                <input
                  type="text"
                  value={searchStr}
                  onChange={e => setSearchStr(e.target.value)}
                  placeholder="🔍 Rechercher"
                />
              </li>
            </ul>
            </div>
            <main>
              <ul className="cards-container">
                {
                  trajectories
                  .filter(({data}) => searchStr.length ? JSON.stringify(data).toLowerCase().includes(searchStr.toLowerCase()) : true)
                  .map(({ _id, data }) => {

                    const handleDelete = () => {
                      if (window.confirm(`Es-tu sûr de vouloir détruire la trajectoire "${data?.part1_general?.name}"`)) {
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
                      <TrajectoryCard 
                        key={_id} 
                        data={data} 
                        onDelete={handleDelete}
                        onChangePassword={handleChangePassword}
                      />
                    )
                  })
                }
              </ul>
            </main>

            <footer>
              <button onClick={handlePromptNewTrajectory}>
                Créer une nouvelle trajectoire
              </button>
            </footer>
          </>
          : null
      }
      {
        newTrajectoryPrompted ?
        <div onClick={() => setNewTrajectoryPrompted(false)} className="new-trajectory-form-container">
          <NewTrajectoryForm
            onSubmit={handleCreateNewTrajectory}
            onCancel={() => setNewTrajectoryPrompted(false)}
          />
          </div>
          :
          null
      }
    </div>
  )
}