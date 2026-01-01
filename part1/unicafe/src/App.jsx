import { useState } from "react";

const Headers = ({text}) => {
  return (
    <h1>{text}</h1>
  )
};

const Button = ({onClick, text}) => {
  return (
    <button onClick={onClick}>{text}</button>
  )
};

// A separate component for statistics
const Statistics = ({good, neutral, bad}) => {
  const total = good + neutral + bad;
  const average = (good - bad) / total;
  const positive = 100 / (total / good);
  // if there are no statistics, we won't display any of them 
  if(total === 0){
    return (
      <p>No feedback given</p>
    )
  }
  return (
      <table>
        <tbody>
          <StatisticLine  text="good" value={good}/>
          <StatisticLine  text="bad" value={bad}/>
          <StatisticLine  text="neutral" value={neutral}/>
          <StatisticLine  text="all" value={total}/>
          <StatisticLine  text="average" value={average}/>
          <StatisticLine  text="positive" value={positive}/>
        </tbody>
      </table>
  )
};

const StatisticLine = ({text, value}) => {
  // Add '%' for statistic of positive 
  if(text === "positive"){
    return (
      <tr>
          <td>{text}</td>
          <td>{value} %</td>
      </tr>
  )
  }
  return (
    <tr>
        <td>{text}</td>
        <td>{value}</td>
    </tr>
  )
};

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const handleGoodClick = () => setGood(good + 1);
  const handleNeutralClick = () => setNeutral(neutral + 1);
  const handleBadClick = () => setBad(bad + 1);

  return (
    <div>
      <Headers text="give feedback" />
      <Button onClick={handleGoodClick} text="good"/>
      <Button onClick={handleNeutralClick} text="neutral" />
      <Button onClick={handleBadClick} text="bad"/>
      <Headers text="statistics" />
      <Statistics good={good} neutral={neutral} bad={bad}/>
    </div>
  );
};

export default App;
