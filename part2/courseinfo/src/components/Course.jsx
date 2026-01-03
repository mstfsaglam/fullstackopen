const Course = ({ courses }) => {
  return(
    <div>
      {courses.map(course => {
        return (
          <div key={course.id}>
            <Header name={course.name}/>
            <Content content={course.parts}/>
            <Total parts={course.parts}/>
          </div>
        )
        })}
    </div>
  )
}

const Header = ({ name }) => {
  return (
    <h2>{name}</h2>
  )
}

const Content = ({ content }) => {
  return (
    <div>
      {content.map(part => 
        <Parts parts={part.name} exercises={part.exercises} key={part.id}/>
      )}
    </div>
  )
}

const Parts = ({ parts, exercises }) => {
  return (
    <p>{parts} {exercises}</p>
  )
}

const Total = ({ parts }) => {
  const total = parts.reduce((sum, part) => sum + part.exercises,0);
  return (
    <h4>total of {total} exercises</h4>
  )
}

export default Course