// React Hooks
import { useState, useEffect, useMemo } from 'react';

// Styling
import styles from '../styles/Home.module.css'

// Function To Help Sort By Proximity To Location
import { orderByDistance } from 'geolib';

// Material UI Spinner Component
import CircularProgress from '@mui/material/CircularProgress';


export default function Home() {
  
// STATE

  // Establishing State For Loading Status
  const [isLoading, setIsLoading] = useState(true);

  // Establishing State To Store School Directory Data
  const [schoolList, setSchoolList] = useState([] as any);

  // Establishing State To Catch Errors
  const [errors, setErrors] = useState({});

  // Establishing State To Store Whether Access To Location Has Been Granted
  const [location, setLocation] = useState({} as Location);

  // Establishing State For Search
  const [search, setSearch] = useState('')


// HOOKS

  // Fetching School Directory From Beacon API
  useEffect(() => {
    fetch('https://api.sendbeacon.com/team/schools')
      .then((resp) => resp.json())
      .then((data) => {
        let list: any = Object.entries(data)[0][1]
        setIsLoading(false);
        setSchoolList(list);
      })
      .catch((errors) => setErrors(errors));
  }, []);

  // Requesting Permission To Access Location
  useEffect(() => getGeolocation(), []);

  // Calling The chooseSort Function To Determine Which Sorting Method To Use
  useMemo(() => chooseSort(location), [location]);
  

// TYPESCRIPT INTERFACING

  // School Interface
  interface School {
    id: string;
    name: string
    type: string
    zipCode: string      
    enrolled: number
    applicants: number
    admitted: number
    tuition: number
    highestDegree: string
    county: string 
    state: string
    coordinates: {
      lat: number
      long: number
    } 
  }

  // Location Interface
  interface Location {
    latitude: number;
    longitude: number
  }


// FUNCTIONS

  // Geolocation Permission
  function getGeolocation() {
    navigator.geolocation.getCurrentPosition((position) => setLocation({latitude: position.coords.latitude, longitude: position.coords.longitude}))
  }

  // Sorting Schools Alphabetically
  function compare(schoolName: string) {
    return schoolName.replace(/^(The University of |University of |University of the |The College of)/i, '').trim()
  }

  // Determing Which Sorting Method Should Be Used Based On Location
  function chooseSort(location: Location) {
    if (Object.keys(location).length > 0) {
      let revisedList = schoolList.map((school:School) => {
       return {...school, latitude: school.coordinates.lat, longitude: school.coordinates.long}
      })
      setSchoolList(orderByDistance({latitude: location.latitude, longitude: location.longitude}, revisedList))
    } else {
      schoolList.sort(function (a: School, b: School) {
        if(compare(a.name) > compare(b.name)) {
          return 1
        } else {
          return -1
        }
      })
      setSchoolList(schoolList)
    }
  }


// SEARCH FILTERING

  // Filtering Schools Based On Search
  let searchedSchools = schoolList.filter(
    (school: School) =>
      school.name.toLowerCase().includes(search.toLowerCase())
  );


// CARD RENDERING

  // Individual School Cards To Render
  let renderSchools = searchedSchools.map((school:School) => {
    return (
      <div key={school.id} className={styles.card}>
        <div className={styles.avatar}><p className={styles.avatar_text}>{school.name[0]}</p></div>
        <div className={styles.school_text_container}><p className={styles.school_name}>{school.name}</p><p className={styles.school_county}>{school.county.replace(/ County| Parish| city/g, '')}</p></div>
      </div>
    )
  })


  return (
    <div className={styles.document}>
      <div className={styles.header}>
        <svg className={styles.logo_image} viewBox="0 0 70 57" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M33.159 32.412C34.2673 31.6598 35.7327 31.6598 36.841 32.412L69.397 54.5079C70.5192 55.2696 69.9713 57 68.608 57H61.025C60.0855 57 59.1683 56.7189 58.3949 56.1941L36.8417 41.5657C35.7334 40.8135 34.2679 40.8135 33.1597 41.5657L11.6064 56.1941C10.8331 56.7189 9.91582 57 8.97636 57H1.39204C0.02871 57 -0.519157 55.2696 0.603032 54.5079L33.159 32.412Z" fill="white"/>
          <path d="M36.8417 49.9078C35.7334 49.1557 34.2679 49.1557 33.1597 49.9078L27.6059 53.6772C26.1096 54.6928 26.8401 57 28.6579 57H41.3434C43.1612 57 43.8917 54.6928 42.3954 53.6772L36.8417 49.9078Z" fill="white"/>
          <path d="M40.5581 19.5926C40.5581 22.6123 38.0698 25.0602 35.0004 25.0602C31.9309 25.0602 29.4427 22.6123 29.4427 19.5926C29.4427 16.5728 31.9309 14.1249 35.0004 14.1249C38.0698 14.1249 40.5581 16.5728 40.5581 19.5926Z" fill="white"/>
          <path d="M23.4216 31.2308C21.8022 32.33 19.5713 32.1312 18.472 30.5259C16.3334 27.403 15.0852 23.6412 15.0852 19.5926C15.0852 8.77189 24.0015 0 35.0004 0C45.9992 0 54.9155 8.77189 54.9155 19.5926C54.9155 23.6414 53.6672 27.4034 51.5285 30.5263C50.4292 32.1315 48.1983 32.3303 46.5789 31.2312C44.8508 30.0583 44.7467 27.5722 45.8057 25.7888C46.8861 23.9692 47.5052 21.852 47.5052 19.5926C47.5052 12.7982 41.9066 7.29025 35.0004 7.29025C28.0941 7.29025 22.4955 12.7982 22.4955 19.5926C22.4955 21.8519 23.1146 23.969 24.1949 25.7886C25.2538 27.5719 25.1497 30.058 23.4216 31.2308Z" fill="white"/>
        </svg>
        <p className={styles.logo_text}>BEACON</p>
      </div>
      <div className={styles.school_content}>
        <h1 className={styles.heading}>Pick Your School</h1>
        <div className={styles.search_container}>
          <svg className={styles.search_icon} width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M13 7.5C13 10.5376 10.5376 13 7.5 13C4.46243 13 2 10.5376 2 7.5C2 4.46243 4.46243 2 7.5 2C10.5376 2 13 4.46243 13 7.5ZM12.0241 13.4824C10.7665 14.4349 9.19924 15 7.5 15C3.35786 15 0 11.6421 0 7.5C0 3.35786 3.35786 0 7.5 0C11.6421 0 15 3.35786 15 7.5C15 9.22183 14.4198 10.8081 13.4442 12.0741L17.6743 16.3042C18.0648 16.6947 18.0648 17.3279 17.6743 17.7184C17.2838 18.1089 16.6506 18.1089 16.2601 17.7184L12.0241 13.4824Z" fill="#6023E5"/>
          </svg>
          <input className={styles.search_text} placeholder="Search for your school...." onChange={(e) => setSearch(e.target.value)}/>
          <hr className={styles.search_line}/>
        </div>
        <div className={styles.school_container}>
          {isLoading ? <CircularProgress className={styles.spinner} sx={{color: "white"}} /> : <>{renderSchools}</>}
        </div>
      </div>
    </div>
  )
}


  // useEffect(() => {
  //   fetch('https://api.sendbeacon.com/team/schools')
  //     .then((resp) => resp.json())
  //     .then((data) => {
  //       let list: any = Object.entries(data)[0][1]
  //       setIsLoading(false);
  //       setSchoolList(list);
  //     })
  //     .then(() => getGeolocation())
  //     .catch((errors) => setErrors(errors));
  // }, []);

  // function getGeolocation() {
  //   navigator.geolocation.getCurrentPosition(proximitySort, alphabeticallySort)
  // }

  // function proximitySort(location: Location) {
  //   let revisedList = schoolList.map((school:School) => {
  //     return {...school, latitude: school.coordinates.lat, longitude: school.coordinates.long}
  //   })
  //   setSchoolList(orderByDistance({latitude: location.latitude, longitude: location.longitude}, revisedList))
  // }

  // function alphabeticallySort(location: Location) {
  //   schoolList.sort(function (a: School, b: School) {
  //     if(compare(a.name) > compare(b.name)) {
  //       return 1
  //     } else {
  //       return -1
  //     }
  //   })
  //   setSchoolList(schoolList)
  // }