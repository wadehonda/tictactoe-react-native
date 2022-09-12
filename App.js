import { StyleSheet, Button, Text, View, TouchableOpacity, Alert} from 'react-native';
import { useState, useRef } from "react";

function Square(props) {
  return (
    <View style={squareStyle.container}>
      <TouchableOpacity style={squareStyle.square} onPress={props.onChange}>
      <Text style={[squareStyle.squareValue, {color: props.lastSquare ? "red" : "black", backgroundColor: props.winningSquare ? "springgreen" : "white"}]}>
        {props.value}
        </Text>
      </TouchableOpacity>
     </View>
  );
}

function Board(props) {
  const rowLayout = (i) => {
    const row = gameLines[i];
    return (
      <View key={i} style={boardStyle.row}>
        {row.map((x) => (
          <Square
            key={x}
            value={props.squares[x]}
            lastSquare={props.lastSquare === x}
            winningSquare={props.winningSquares?.includes(x)}
            onChange={() => props.onChange(x)}
          />
        ))}
      </View>
    );
  };

  const content = [0, 1, 2].map((x) => rowLayout(x));
  return <View style={boardStyle.board}>{content}</View>;
}

export default function App() {
  const end = useRef(false);
  const nextStone = useRef("X");
  const [record, setRecord] = useState([{ squares: Array(9).fill(null) }]);
  const [move, setMove] = useState(0);
  const [index, setIndex] = useState(0);

  let currentSquares = record[index].squares;
  let lastSquare = record[index].lastSquare;

  const reset = () => {
    end.current = false;
    setRecord([{ squares: Array(9).fill(null), lastSquare: null }]);
    nextStone.current = "X";
    setMove(0);
    setIndex(0);
  };

  const next = () => {
    if (index < record.length - 1) {
      setIndex(index + 1);
    }
  };

  const prev = () => {
    if (index > 0) {
      setIndex(index - 1);
    }
  };
  const goTo = (step) => {
    setIndex(step);
    if (step % 2 === 0) {
      nextStone.current = "X";
    } else {
      nextStone.current = "O";
    }
  };

  const handleChange = (i) => {
    if (!end.current) {
      const temp = currentSquares.slice();
      if (currentSquares[i] == null) {
        temp[i] = nextStone.current;
        nextStone.current =
          nextStone.current === "X"
            ? (nextStone.current = "O")
            : (nextStone.current = "X");
        setRecord([...record, { squares: temp, lastSquare: i }]);
        setMove(move + 1);
        setIndex(index + 1);
      } else {
        Alert.alert("illegal move");
      }
    }
  };

  const squares = currentSquares.slice();
  let winner = gameEnding(squares);
  let winningSquares = null;
  let result = null;
  if (winner) {
    end.current = true;
    result = winner[0] + " win";
    winningSquares = gameLines[winner[1]];
  } else if (!currentSquares.includes(null)) {
    end.current = true;
    result = "Draw";
  }
  const status = !end.current ? "Next move is " + nextStone.current : result;

  return (
    <View style={[appStyle.container]}>
      <Text style={[appStyle.info, {fontSize: 24}]}>Tic-Tac-Toe</Text>
      <View style={boardStyle.container}>
        <Board
          lastSquare={lastSquare}
          winningSquares={winningSquares}
          squares={currentSquares}
          onChange={(i) => handleChange(i)}
        />
      </View>
      <Text style={appStyle.info}>{status}</Text>
        {end.current && (
      <View style={appStyle.controls}>
          <Text style={appStyle.info}>Replay the Completed Game</Text>
          <View style={{flexDirection: 'row'}}>
              <View style={{flex: 0.5, padding: 3}}><Button  title="Back" onPress={() => prev()}/></View>
              <View style={{flex: 0.5, padding: 3}}><Button  title="Forward" onPress={() => next()}/></View>
          </View>
          <View style={{flexDirection: 'row'}}>
              <View style={{flex: 1, padding: 3}}>
                  <Button title="New game" onPress={() => reset()}/>
              </View>
          </View>
      </View>
        )}
    </View>
  );
}

const gameLines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function gameEnding(squares) {
  for (let i = 0; i < gameLines.length; i++) {
    const [a, b, c] = gameLines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], i];
    }
  }
  return null;
}

const appStyle = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 2,
    backgroundColor: 'rebeccapurple'
  },
  info: {
    textAlign: 'center',
    margin: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white'
  }, 
  controls: {
    justifyContent: 'center',
    alignItems: 'center'
  }
});

const boardStyle = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  board: {
    backgroundColor: 'springgreen',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
});

const squareStyle = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  square: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 60, 
    height: 60,
    marginVertical: 1,
    marginHorizontal: 1, 
    backgroundColor: 'white'
  },
  squareValue: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'black'
  }
});
