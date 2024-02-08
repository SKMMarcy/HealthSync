import React from 'react'
import { useState } from 'react'
import "./styles/ExerciseList.css"
const ExerciseList = (props) => {
    const {exercises, exerciseIndex, setExerciseIndex } = props
    const handleExerciseClick = (index) => {
        setExerciseIndex(index);
    };

  return (
    <>
        <ul className='exercise-list'>
        {exercises.map((exercise, index) => {
         return (<li className={`list-item ${exerciseIndex === index ? 'active' : ''}`}
         bindex={index} 
         key={exercise.name + exercise.id}
         onClick={() => handleExerciseClick(index)}>{exercise.name}
         </li>)
    })}
    {exercises.length === 0 && "No exercises 😹"}
        </ul>
    </>
    
  )
}

export default ExerciseList