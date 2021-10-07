import React from 'react'
const Course = ({courses}) => {
    return (
      <div>
        {courses.map( c => <div key={c.id+1000}>
          <Header text={c.name} key={c.id}/> 
          <Content parts={c.parts} key={c.id+100} />
          <Total  parts={c.parts}/> </div> )}
      </div>
    );
  }
  const Part = ({part}) => {

    return (
      <p> {part.name} {part.exercises} </p>
    )
  }
  const Header = (props) => {
    
    return (
      <div>
        <h1> {props.text} </h1>
      </div>
    )
  }
  const Content = ({parts}) => {
  
    return (
      <div>
        {
           parts.map(part => <Part key={part.id} part={part} />)
        }
        
      </div>
      )
  }
  const Total = ({parts}) => {
    return (
      <div>
        <h4>Total of {
           parts.reduce( (sum, x) => {
             return sum+x.exercises;
           } , 0 )
         } exercises
        </h4>
      </div>
    );
  }
export default Course