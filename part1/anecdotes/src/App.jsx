import { useState } from 'react'

const Header = ({text}) => {
  return (
    <h1>{text}</h1>
  )
}

const Anecdote = ({anecdote}) => {
  return (
    <p>{anecdote}</p>
  )
}

const VotesNum = ({votes}) => {
  return (
    <p>has {votes} votes</p>
  )
}

const Button = ({onClick, text}) => {
  return (
    <button onClick={onClick}>{text}</button>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState(new Array(anecdotes.length).fill(0));
  
  const setToSelected = () => {
    const randomNumber = Math.floor(Math.random() * anecdotes.length);
    setSelected(randomNumber);
  }

  const handleVotesClick = () => {
    const votesListCopy = [...votes]; 
    votesListCopy[selected] +=  1;
    setVotes(votesListCopy);
  }

  let mostVoteIndex = 0;
  for(let i = 1; i < anecdotes.length; i++){
    if(votes[i] > votes[mostVoteIndex]){
      mostVoteIndex = i;
    }
  }
  
  return (
    <div>
      <Header text="Anecdote of the day"/>
      <Anecdote anecdote={anecdotes[selected]} />
      <VotesNum votes={votes[selected]}/>
      <Button onClick={handleVotesClick} text="vote"/>
      <Button onClick={setToSelected} text="next anecdote"/>
      <Header text="Anecdote with most votes"/>
      <Anecdote anecdote={anecdotes[mostVoteIndex]} />
      <VotesNum votes={votes[mostVoteIndex]}/>
    </div>
  )
}

export default App