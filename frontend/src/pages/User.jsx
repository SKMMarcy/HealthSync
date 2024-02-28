import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { IoIosNotifications } from 'react-icons/io';
import CurrentUserContext from '../contexts/current-user-context';
import {
  destroyUser,
  fetchJoinedEvents,
  getUser,
} from '../adapters/user-adapter';
import { logUserOut } from '../adapters/auth-adapter';
import UpdateUsernameForm from '../components/UpdateUsernameForm';
import EventForm from '../components/EventForm';
import Event from '../components/Event';
import { destroyEvent } from '../adapters/event-adapter';
import {
  fetchNotifications,
  deleteNotifications,
  createANotification,
} from '../adapters/notification-adapter';
import { useUserStore } from '../store/store';
import Spline from '@splinetool/react-spline';
import { NavLink } from 'react-router-dom';
import Footer from '../components/Footer';
import Navigation from '../components/Navigation';

export default function UserPage() {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
  const {
    userProfile,
    setUserProfile,
    events,
    setUserEvents,
    errorText,
    setErrorText,
  } = useUserStore((state) => state);
  const [notifications, setNotifications] = useState([]);
  const [notifInit, setNotifInit] = useState(false);
  const [seenNotif, setSeenNotif] = useState(false);
  const [joinedEvents, setJoinedEvents] = useState({});
  const [jEvents, setJevents] = useState([]);
  console.log(jEvents )

  const { id } = useParams();
  const isCurrentUserProfile = currentUser && currentUser.id === Number(id);
  const [activeTab, setActiveTab] = useState('events');
  const [activeDiv, setActiveDiv] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const [user, error] = await getUser(id);
      if (error) return setErrorText(error.message);
      setUserProfile(user);
      if (isCurrentUserProfile) loadJoinedEvents(currentUser.id);
    };

    setUserEvents(id);

    loadUser();
  }, [id]);

  useEffect(() => {
    const getNotifications = async () => {
      const notifs = await fetchNotifications(id);
      console.log(notifs);
      setNotifications(notifs);
    };

    getNotifications(id);
  }, []);

  const handleLogout = () => {
    logUserOut();
    setCurrentUser(null);
    navigate('/');
  };

  const handleDelete = () => {
    setCurrentUser(null);
    navigate('/login');
    destroyUser({ id });
  };

  const loadJoinedEvents = async () => {
    if (currentUser) {
      const signedEvents = await fetchJoinedEvents(currentUser.id);
      console.log('signed Events: ', signedEvents);
      setJevents(signedEvents);
      const obj = {};
      signedEvents.forEach((event) => {
        obj[event.id] = true;
      });
      setJoinedEvents(obj);
      console.log(obj);
    }
  };

  if (!userProfile && !errorText) return null;
  if (errorText) return <p>{errorText}</p>;

  const profileUsername = isCurrentUserProfile
    ? currentUser.username
    : userProfile.username;

  const deleteEvent = (evId) => {
    destroyEvent({ event_id: evId });
    setUserEvents(id);
  };

  const removeNotification = async (userId) => {
    deleteNotifications(userId);
  };

  const profilePic = isCurrentUserProfile
    ? currentUser.profile_pic
    : userProfile.profile_pic;

  console.log(events);
  // console.log(currentUser.profile_pic)

  

  return (
    <>
      {/* <h1>{profileUsername}</h1> */}
      {/* {!!isCurrentUserProfile && (
        <button onClick={handleLogout}>Log Out</button>
      )}
      {!!isCurrentUserProfile && (
        <button onClick={handleDelete}>Delete Account</button>
      )} */}

      {/* <div className='bg-gray-200 h-2 top-0 left-0 border-solid border-2 border-gray-400 '>
        <div className='profile flex flex-row'>
          <div className='max-w-16 max-h-16 flex justify-center'>
          <img
            className="rounded-full"
            src={`../upload/${ 'default.jpg'}`}
            width={'full'}
            height={'full'}
          />
          </div>
          <div className='flex justify-center items-center font-medium ml-2'>
            <p> user </p>
          </div>    
        </div>
      </div> */}

      <Navigation currentUser={currentUser} />

      <div className="h-[287px] bg-center bg-no-repeat bg-cover relative bg-blue-300">

        <div className='profile flex flex-row absolute bottom-0 left-0 px-52'>
          <div className='max-w-48 max-h-48 flex justify-center items-center'>
            <img
              className="rounded-t-lg"
              src={`../upload/${profilePic ? profilePic : 'default.jpg'}`}
              width={'full'}
              height={'full'}
            />

            <div className='flex font-bold text-white bg-slate-700 items-center justify-center h-12 -ml-8 p-12'>
              <h1 className="inline-block text-5xl font-semibold"> {profileUsername} </h1>
            </div> 

          </div>
        </div>
      </div>
    
    
    <div className="flex flex-row items-center justify-center space-x-14 bg-white font-medium text-gray-500 text-2xl">
      {/* <button  
        className={`w-20 h-10 flex items-center justify-center ${activeTab === 'overview' ? 'text-blue-600 font-medium' : 'text-gray-500'} hover:text-blue-200`} 
        onClick={() => setActiveTab('overview')}
      >
        Overview
      </button> */}
      <div className={`events ${activeTab === 'events' ? 'bg-blue-200 p-5' : ''}`}>
        <button  
          className={`w-20 h-10 flex items-center justify-center ${activeTab === 'events' ? 'text-blue-600 font-semibold' : 'text-gray-500'}`} 
          onClick={() => setActiveTab('events')}
        >
          Events
        </button>
      </div>

      {/* className={`management ${activeTab === 'management' ? 'bg-blue-200 p-5' : ''}`} */}
      
      <div className={`management ${activeTab === 'management' ? 'bg-blue-200 p-5' : ''}`}>
        <button  
          className={`h-10 flex items-center justify-center ${activeTab === 'management' ? 'text-blue-600 font-semibold' : 'text-gray-500'}`} 
          onClick={() => setActiveTab('management')}
        >
          Management
        </button>
      </div>
    
    </div>

    


    {/* {activeTab === 'overview' && <Overview />} */}
    {activeTab === 'events' && <Events />}
    {activeTab === 'management' && <Management />}

      {console.log(activeTab)}

      {/* <EventForm id={id} loadUserEvents={() => setUserEvents(id)} /> */}

      {/* { userProfile.profile_pic &&<img src={imagePath}></img>} */}
    </> // /upload/${userProfile.profile_pic}
  );

    // function Overview() {
    //   return <div className='mb-12 h-screen'>This is the overview tab.</div>;
    // }
    
    //The Function is there to take advantage of hoisting don't change to arrow function

    function Events() {
      return (
        <div className='mb-12 max-h-full pb-32 px-52'>
          {events[0] && <p className='font-bold mt-7 mb-7' style={{ fontSize: '42px' }}>My Events</p>}
          <div className='grid grid-cols-3'>
            {events[0] &&
              events.map((event) => (
                <Event
                  key={event.id - 800}
                  deleteEvent={() => deleteEvent(event.id)}
                  event={event}
                  loadJoinedEvents={loadJoinedEvents}
                  joinedEvents={joinedEvents}
                />
              ))}
          </div>
        
          <div className=''>
            {jEvents && <p className='font-bold mt-7 mb-7' style={{ fontSize: '42px' }}>Joined Events</p>}
            <div className='grid grid-cols-3'>
              {jEvents.length > 0 ?
                jEvents.map((event) => (
                  <Event
                    key={event.id - 800}
                    event={event}
                    loadJoinedEvents={loadJoinedEvents}
                    joinedEvents={joinedEvents}
                  />
                ))
                : (<div className='max-w-xs relative flex'> <p className='s mt-7 mb-7'>No joined events :[</p> </div>)
                
                }

  {/* <p>No events</p> */}
            </div>
          </div>
          
        
        </div>
      );
    }
    
    function Management() {
      return (
        <div className='mb-12 max-h-full pb-32 px-52'>
          <h1 className='font-bold mt-7 mb-7' style={{ fontSize: '42px' }}> Mangament </h1>
            <div className='grid grid-cols-2 gap-4 w-80 w-44 text-xl'>
              <div className='bg-blue-200 h-56 font-medium'>
                <div 
                  className='profile flex flex-row' 
                  onClick={() => setActiveDiv('profile')}
                >
                  <div className='border-r-4 border-blue-600 max-h-full'></div>
                  <p className='p-2 cursor-pointer'> Profile </p>
                </div>
                
                <div 
                  className='notifications flex flex-row' 
                  onClick={() => setActiveDiv('notifications')}
                >
                  <div className='border-r-4 border-blue-400 max-h-full'></div>
                  <p className='p-2 cursor-pointer'> Notification </p>
                </div>
              </div>

              {activeDiv === 'profile' && (
                <div>
                  {isCurrentUserProfile && (
                    <UpdateUsernameForm
                      currentUser={currentUser}
                      setCurrentUser={setCurrentUser}
                    />
                  )}

                  <div className='w-full mt-5'>
                    {isCurrentUserProfile && (
                      <button onClick={handleLogout}>Log Out</button>
                    )}
                    {isCurrentUserProfile && (
                      <button onClick={handleDelete}>Delete Account</button>
                    )}
                  </div>  
                </div>
              )}

              {activeDiv === 'notifications' && (
                <div>
                  {isCurrentUserProfile && (
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                      <IoIosNotifications
                        size={35}
                        onClick={async () => {
                          setNotifInit(!notifInit);
                          setSeenNotif(true);
                          console.log('HUH');
                          // console.log(currentUser);
                          // console.log(currentUser.id);
                          await removeNotification(id);
                        }}
                      />
                      {notifications.length > 0 && !seenNotif && (
                        <div
                          style={{
                            position: 'absolute',
                            top: '5%',
                            right: '5px',
                            width: '12px',
                            height: '12px',
                            backgroundColor: 'red',
                            borderRadius: '50%',
                          }}
                        ></div>
                      )}
                    </div>
                  )}

                  {isCurrentUserProfile && <h2>Notifications : {notifications.length}</h2>}
                  {notifInit &&
                    notifications.map((notif, idx) => <p key={idx}>{notif.text}</p>)}

                  
                  {/* <EventForm id={id} loadUserEvents={() => setUserEvents(id)} /> */}
                </div>
              )}

             
            </div>
        
          {console.log(userProfile)}
          {/* <img src="/upload/1706824948115wowow.png" alt="img" /> */}
          {/* {userProfile.profile_pic && (
            // <img src={`../public/upload/${profilePic}`}></img>
            <h1>hi</h1>
          )} */}
        {console.log(notifications)}

        {/* {isCurrentUserProfile && (
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <IoIosNotifications
              size={35}
              onClick={async () => {
                setNotifInit(!notifInit);
                setSeenNotif(true);
                console.log('HUH');
                // console.log(currentUser);
                // console.log(currentUser.id);
                await removeNotification(id);
              }}
            />
            {notifications.length > 0 && !seenNotif && (
              <div
                style={{
                  position: 'absolute',
                  top: '5%',
                  right: '5px',
                  width: '12px',
                  height: '12px',
                  backgroundColor: 'red',
                  borderRadius: '50%',
                }}
              ></div>
            )}
          </div>
        )}

        {isCurrentUserProfile && <h2>Notifications : {notifications.length}</h2>}
        {notifInit &&
          notifications.map((notif, idx) => <p key={idx}>{notif.text}</p>)}


          {!!isCurrentUserProfile && (
            <button onClick={handleLogout}>Log Out</button>
          )}
          {!!isCurrentUserProfile && (
            <button onClick={handleDelete}>Delete Account</button>
          )} */}
            {/* <EventForm id={id} loadUserEvents={() => setUserEvents(id)} /> */}
        </div>

        
    );
  }
}
