
class Graph {
  constructor () {
    this.vertices = [];
    this.edges = [];
  }

  addVertex (value) {
    if (!this.vertices.includes(value)) {
      this.vertices.push(value);
      return true;
    }
    return false;
  }

  addEdge (valueX, valueY, directed = false, weight = 1) {
    if (!this.vertices.includes(valueX) || !this.vertices.includes(valueY)) return false;
    if (this.edges.some(edge => edge[0] === valueX && edge[1] === valueY && edge[2] === weight)) return false;
    this.edges.push([valueX, valueY, weight]);
    if (!directed && valueX != valueY) this.edges.push([valueY, valueX, weight]);
    return true;
  }

  removeEdge (valueX, valueY) {
    if (!this.vertices.includes(valueX) || !this.vertices.includes(valueY)) return false;
    this.edges = this.edges.filter(edge => !(edge[0] === valueX && edge[1] === valueY));
  }

  getEdgeValue (valueX, valueY) {
    valueX = Number(valueX);
    valueY = Number(valueY);
    if (!this.vertices.includes(valueX) || !this.vertices.includes(valueY)) return false;
    let edge = this.edges.filter(edge => (edge[0] === valueX && edge[1] === valueY));
    if (edge.length === 1) return edge[0][2];
    return false;
  }
  
  removeVertex (valueX) {
    if (!this.vertices.includes(valueX)) return false;
    this.vertices = this.vertices.filter(vertex => vertex !== valueX);
    this.edges = this.edges.filter(edge => !(edge[0] === valueX || edge[1] === valueX));
    return true;
  }

  adjacent (valueX, valueY) {
    if (!this.vertices.includes(valueX) || !this.vertices.includes(valueY)) return false;
    return this.edges.some(edge => edge[0] === valueX && edge[1] === valueY);
  }

  neighbors (valueX) {
    valueX = Number(valueX);
    let out = [];
    this.edges.forEach(edge => {
      if (edge[0] === valueX) out.push(edge[1]);
    });
    return out;
  }

  dFSShortest (valueX, valueY, path = [valueX]) {
    let paths = [];
    let neighbors = this.neighbors(valueX);
    //console.log(neighbors);
    if (neighbors.includes(valueY)) return path.concat([valueY]);
    for (let neighbor of neighbors) {
      if (path.includes(neighbor)) continue;
      let search = this.dFSShortest(neighbor, valueY, path.concat(neighbor));
      if (search) paths.push(search);
    }
    if (paths.length) {
      paths = paths.reduce((acc, path) => path.length < acc.length ? path : acc);
      return paths;
    }
    return false;
  }
  
  dFS (valueX, valueY, path = [valueX]) {
    let neighbors = this.neighbors(valueX);
    //console.log(neighbors);
    if (neighbors.includes(valueY)) return path.concat([valueY]);
    for (let neighbor of neighbors) {
      // console.log({neighbor, path});
      if (path.includes(neighbor)) continue;
      let search = this.dFS(neighbor, valueY, path.concat(neighbor));
      if (search) return search;
    }
    return false;
  }
  bFS (valueX, valueY) {
    let neighbors = [[valueX, [valueX]]];
    for (let i = 0; i < neighbors.length; i++) {
      let neighbor = neighbors[i][0];
      let path = neighbors[i][1];
      if (neighbor === valueY) {
        return path;
      }
      for (let nextNeighbor of this.neighbors(neighbor)) {
        if (path.includes(nextNeighbor)) continue;
        neighbors.push([nextNeighbor, path.concat([nextNeighbor])]);
      }
    }
    return false;
  }

  dijkstra (valueX, valueY) {
    console.log('dijkstra')
    let unvisitedNodes = {};
    let visitedNodes = {};
    for (let vertex of this.vertices) {
      if (vertex === valueX) unvisitedNodes[valueX] = 0;
      else unvisitedNodes[vertex] = Infinity;
    }
    while (Object.keys(unvisitedNodes).length) {
      let node = Object.keys(unvisitedNodes).reduce((acc, key) => {
        return unvisitedNodes[key] < acc[1] ? [key, unvisitedNodes[key]] : acc;
      }, ['null', Infinity]);
      visitedNodes[node[0]] = unvisitedNodes[node[0]];
      // console.log(node);
      console.log(node, visitedNodes, unvisitedNodes);
      if (node[0] === valueY) break;
      if (node[1] === Infinity) return false;
      console.log();
      let neighbors = this.neighbors(node[0]);
      console.log({neighbors})
      for (let neighbor of neighbors) {
        let weight = this.getEdgeValue(node[0], neighbor);
        let sum = unvisitedNodes[node[0]] + weight;
        if (sum < unvisitedNodes[neighbor]) unvisitedNodes[neighbor] = sum;
      }
      // console.log(node);
      delete unvisitedNodes[node[0]];
      // console.log(unvisitedNodes);
    }
    
    let keys = Object.keys(visitedNodes).reverse();
    let path = [keys[0]];
    for (let i = 0; i < keys.length; i++) {
      console.log(path);
      let to = path[path.length-1];
      for (let j = i; j < keys.length; j++) {
        let from = keys[j];
        let weight = this.getEdgeValue(from, to);
        console.log({from, to, weight});
        if (weight) {
          if (visitedNodes[to] - weight === visitedNodes[from]) {
            path.push(from);
            i = j;
          }
        }
      }
    }
    console.log(visitedNodes);
    return path.reverse().map(el=>Number(el));

  }

  isConnected () {
    for (let vertex1 of this.vertices) {
      for (let vertex2 of this.vertices) {
        if (!this.findPath(vertex1, vertex2)) {
          // console.log(vertex1, vertex2);
          return false;
        }
      }
    }
    return true;
  }

  recommend (valueX) {
    if (!this.vertices.includes(valueX)) return false;
    let neighbors = this.neighbors(valueX);
    console.log('neighbors:', neighbors)
    let dict = {};
    for (let neighbor of neighbors) {
      console.log('Neighbors of', neighbor);
      for (let node of this.neighbors(neighbor)) {
        if (neighbors.includes(node) || node === valueX) continue;
        console.log('-', node)
        if (dict[node]) dict[node]++;
        else dict[node] = 1;
      }
    }
    let freq = Object.entries(dict).reduce((acc, current) => {
      return acc[1] < current[1] ? current : acc;
    })[1];
    let recs = [];
    Object.entries(dict).forEach(el => {
      if (el[1] === freq) recs.push(el[0]);
    });
    console.log(dict);
    return recs;
  }

}

class Player {
  constructor (origin, id) {
    this.id = id;
    this.origin = origin;
  }

  createPlayerDiv(maze) {
    const newPlayer = $(`<div class="player" id="${this.id}"/>`);
   
    maze.append(newPlayer);
  }
}

class Maze extends Graph {
  constructor (width, height=width) {
    super();
    this.width = width;
    this.height = height;
    this.nodenum = width * height;
    this.defaultEdges = [];
    this.start = 0;
    this.clicked = null;
    this.players = [];
    this.end = this.nodenum - 1;
    this.boxSize = 50
    console.log('hello');
    let $maze = $('.maze');
    $maze.css('display', 'grid')
    $maze.css('grid-template-columns', `repeat(${width}, 1fr)`)
    for (let i = 0; i < this.nodenum; i++) {
      this.addVertex(i);
    }
    for (let i = 0; i < this.nodenum; i++) {
      let $newDiv = $(`<div class="block" id="${i}"></div>`);
      $newDiv.on('click', () => this.clicked = i);
      $maze.append($newDiv);
    }
    for (let i = 0; i < this.nodenum; i++) {
      if (i > this.width) this.addEdge(i, i - this.width);
      if (i < this.nodenum - this.width) this.addEdge(i, i + this.width);
      if (i%this.width > 0) this.addEdge(i, i - 1);
      if (i%this.width < this.width - 1) this.addEdge(i, i + 1);
    }
    this.defaultEdges = this.edges.slice();
    $('.block').css('width', `${this.boxSize}px`)
    $('.block').css('height', `${this.boxSize}px`)
    $(`#${this.start}`).css('background-color', 'orange');
    $(`#${this.end}`).css('background-color', 'green');
    this.adjustBoxSize(0);
  }

  adjustBoxSize(value) {
    this.boxSize += value;
    $('.block').css('width', `${this.boxSize}px`)
    $('.block').css('height', `${this.boxSize}px`)
    $('.player').css('width', `${Math.floor(this.boxSize)}px`)
    $('.player').css('height', `${Math.floor(this.boxSize)}px`)
  }

  async generateMaze (walls = this.width) {
    $('button').prop('disabled', true);
    let $maze = $('.maze')
    $('.block').css('background-color', 'white')
    await this.delay(0);
    $(`#${this.start}`).css('background-color', 'orange');
    $(`#${this.end}`).css('background-color', 'green');
    await this.delay(0);
    $('.block:hover').css('background-color', 'grey')
    await this.delay(0);
    for (let i = 0; i < this.nodenum; i++) {
      let $i = $(`#${i}`);
      $i.removeClass('b');
      $i.removeClass('r');
      $i.removeClass('l');
      $i.removeClass('t');
    }
    // $('.block').css('border', '2px solid black')
    await this.delay(0);
    this.edges = this.defaultEdges;
    let visited = [1];
    let stack = [1];
    let edges = [];
    let count = 0;
    while (stack.length) {
      let i = stack.pop();
      let neighbors = this.neighbors(i).filter(neighbor => !visited.includes(neighbor));
      if (neighbors.length) {
        stack.push(i);
        let neighbor = neighbors[Math.floor(Math.random()*neighbors.length)];
        edges.push([i, neighbor, 1]);
        edges.push([neighbor, i, 1]);
        if (i - neighbor === 1) {
          // $(`#${i}`).css('border-left-color', 'transparent');
          // $(`#${neighbor}`).css('border-right-color', 'transparent');
          $(`#${i}`).addClass('l');
          $(`#${neighbor}`).addClass('r');
        } else if (i - neighbor === -1) {
          // $(`#${i}`).css('border-right-color', 'transparent');
          // $(`#${neighbor}`).css('border-left-color', 'transparent');
          $(`#${i}`).addClass('r');
          $(`#${neighbor}`).addClass('l');
        } else if (i - neighbor === this.width) {
          // $(`#${i}`).css('border-top-color', 'transparent');
          // $(`#${neighbor}`).css('border-bottom-color', 'transparent');
          $(`#${i}`).addClass('t');
          $(`#${neighbor}`).addClass('b');
        } else if (neighbor - i === this.width) {
          // $(`#${i}`).css('border-bottom-color', 'transparent');
          // $(`#${neighbor}`).css('border-top-color', 'transparent');
          $(`#${i}`).addClass('b');
          $(`#${neighbor}`).addClass('t');
        }
        if (count === this.width/2) {
          count = 0;
          await this.delay(0);
        }
        count++;
        stack.push(neighbor);
        visited.push(neighbor);
      }
    }
    this.edges = edges;
    for (let j = 0; j < walls; j++) {
      let i = Math.floor(Math.random()*this.nodenum);
      if (i > this.width) {
        this.addEdge(i, i - this.width);
        // $(`#${i}`).css('border-top-color', 'transparent');
        // $(`#${i - this.width}`).css('border-bottom-color', 'transparent');
        $(`#${i}`).addClass('t');
        $(`#${i - this.width}`).addClass('b');
      };
      if (i < this.nodenum - this.width) {
        this.addEdge(i, i + this.width);
        // $(`#${i}`).css('border-bottom-color', 'transparent');
        // $(`#${i + this.width}`).css('border-top-color', 'transparent');
        $(`#${i}`).addClass('b');
        $(`#${i + this.width}`).addClass('t');
      };
      if (i%this.width > 0) {
        this.addEdge(i, i - 1);
        // $(`#${i}`).css('border-left-color', 'transparent');
        // $(`#${i - 1}`).css('border-right-color', 'transparent');
        $(`#${i}`).addClass('l');
        $(`#${i - 1}`).addClass('r');
      };
      if (i%this.width < this.width - 1) {
        this.addEdge(i, i + 1);
        // $(`#${i}`).css('border-right-color', 'transparent');
        // $(`#${i + 1}`).css('border-left-color', 'transparent');
        $(`#${i}`).addClass('r');
        $(`#${i + 1}`).addClass('l');
      };
      await this.delay(0);
    }
    $('button').prop('disabled', false);
  }
  findPath (valueX, valueY, method = 'dfs') {
    console.log('Choosing path');
    if (!this.vertices.includes(valueX) || !this.vertices.includes(valueY)) return false;
    let path;
    if (valueX === valueY) return true;
    switch (method) {
    case 'bfs':
      path = this.bFS(valueX, valueY);
      break;
    case 'vbfs':
      path = this.visualbFS(valueX, valueY);
      break;
    case 'dfsShort':
      path = this.dFSShortest(valueX, valueY);
      break;
    case 'vdijk':
      console.log('vdijk');
      path = this.visualDijk(valueX, valueY);
      break;
    case 'vastar':
      console.log('vastar');
      path = this.visualAStar(valueX, valueY);
      break;
    default:
      console.log('dfs');
      path = this.dFS(valueX, valueY);
      break;
    }
    if (path) return path;
    return false;
  }

  calcDirection (i) {
    let options = [];
    if (i > this.width) options.push('up');
    if (i < this.nodenum - this.width) options.push('down');
    if (i%this.width > 0) options.push('left');
    if (i%this.width < this.width - 1) options.push('right');
    let result = options[Math.floor(Math.random()*options.length)];
    if (result === 'up') return i - this.width;
    if (result === 'down') return i + this.width;
    if (result === 'left') return i - 1;
    return i + 1;
  }

  displayMaze () {
    let $maze = $('.maze');
    for (let i = 0; i < this.nodenum; i++) {
      let $newDiv = $(`<div class="block" id="${i}"></div>`);
      if (this.getEdgeValue(i, i - 1)) $newDiv.css('border-left-color', 'transparent');
      if (this.getEdgeValue(i, i + 1)) $newDiv.css('border-right-color', 'transparent');
      if (this.getEdgeValue(i, i + this.width)) $newDiv.css('border-bottom-color', 'transparent');
      if (this.getEdgeValue(i, i - this.width)) $newDiv.css('border-top-color', 'transparent');

      $maze.append($newDiv);
    }
    $('.block').css('width', `${100/this.width}%`)
    $('.block').css('height', `${100/this.height}%`)
  }
  
  async showPath(start, end, algo) {
    $('button').prop('disabled', true);
    let path = await this.findPath(start, end, algo);
    for (let item of path) {
      if (item === start || item === end) continue;
      await this.delay(0);
      $(`#${item}`).css('background-color', 'red');
    }
    // $(`#${start}`).css('border', '2px solid orange');
    // $(`#${end}`).css('border', '2px solid orange');
    $('button').prop('disabled', false);
    await this.delay(0);
  }

  delay (time) {
    return new Promise(res => setTimeout(res, time));
  }

  async visualbFS (valueX, valueY) {
    let count = 0;
    // let neighbors = [[valueX, [valueX]]];
    let set = new Set();
    let neighbors = [[valueX, set]];
    let visited = {};
    for (let i = 0; i < neighbors.length; i++) {
      count++;
      if (count >= this.width/2) {
        count = 0;
        let value = await this.delay(0.1);
      }
      let neighbor = neighbors[i][0];
      if (neighbor !== valueX && neighbor !== valueY) $(`#${neighbor}`).css('background-color', 'blue');
      let path = neighbors[i][1];
      if (neighbor === valueY) {
        console.log(path.values());
        return path.values();
      }
      for (let nextNeighbor of this.neighbors(neighbor)) {
        if (visited[nextNeighbor]) continue;
        visited[nextNeighbor] = true;
        let newPath = new Set(path);
        newPath.add(nextNeighbor);
        neighbors.push([nextNeighbor, newPath]);
  
      }
    }
    return false;
  }

  async visualDijk (valueX, valueY) {
    console.log('hello hello')
    let unvisitedNodes = {};
    let count = 0;
    let visitedNodes = new Map();
    for (let vertex of this.vertices) {
      unvisitedNodes[vertex] = Infinity;
    }
    unvisitedNodes[valueX] = 0;
    while (true) {
      count++;
      if (count == this.width/2) {
        await this.delay(0);
        count = 0;
      } 
      let node = Object.keys(unvisitedNodes).reduce((acc, key) => {
        return unvisitedNodes[key] < acc[1] ? [key, unvisitedNodes[key]] : acc;
      }, ['null', Infinity]);
      let cost = unvisitedNodes[node[0]];
      visitedNodes.set(Number(node[0]), cost);
      delete unvisitedNodes[node[0]];
      if (node[1] === Infinity) return false;
      if (Number(node[0]) === valueY) {
        console.log('made it');
        break;
      };
      if (Number(node[0])!==valueX) $(`#${node[0]}`).css('background-color', 'blue');
      let neighbors = this.neighbors(node[0]);
      for (let neighbor of neighbors) {
        let weight = this.getEdgeValue(node[0], neighbor);
        let sum = cost + weight;
        if (sum < unvisitedNodes[neighbor]) unvisitedNodes[neighbor] = sum;
      }
    }

    let path = [valueY];
    let inPath = {valueY:true};
    let options = [1, -1, -1*this.width, this.width];
    while (path[path.length-1] !== valueX) {
      console.table({path});
      let to = path[path.length-1];
      console.log(options);
      for (let from of this.neighbors(to)) {
        if (inPath[from]) continue;
        let weight = this.getEdgeValue(from, to);
        if (weight && visitedNodes.get(to) - weight === visitedNodes.get(from)) {
          path.push(from);
          inPath[from] = true;
          break;
        }
      } 
    }
    path.push(valueX);
    console.log(visitedNodes);
    return path.map(el=>Number(el)).reverse();
  }

  distance (start, end) {
    let x = start%this.width - end%this.width;
    let y = Math.floor(start/this.width) - Math.floor(end/this.width);
    return Math.pow(Math.pow(x, 2) + Math.pow(y, 2), 0.5);
  }

  async visualAStar (valueX, valueY, h=10) {
    console.log('hello hello')
    let unvisitedNodes = {};
    let count = 0;
    let visitedNodes = new Map();
    for (let vertex of this.vertices) {
      unvisitedNodes[vertex] = [Infinity, this.distance(vertex, valueY)*h];
    }
    unvisitedNodes[valueX][0] = 0;
    while (true) {
      count++;
      if (count >= this.width/20) {
        await this.delay(0);
        count = 0;
      } 
      console.log({unvisitedNodes});
      let node = Object.keys(unvisitedNodes).reduce((acc, key) => {
        return unvisitedNodes[key][0] + unvisitedNodes[key][1] < acc[1] + acc[2] ? [key, unvisitedNodes[key][0], unvisitedNodes[key][1]] : acc;
      }, ['null', Infinity, Infinity]);
      console.log(node);
      let cost = unvisitedNodes[node[0]][0];
      console.log({cost})
      visitedNodes.set(Number(node[0]), cost);
      delete unvisitedNodes[node[0]];
      if (node[1] === Infinity) return false;
      if (Number(node[0]) === valueY) {
        console.log('made it');
        break;
      };
      if (Number(node[0])!==valueX) $(`#${node[0]}`).css('background-color', 'blue');
      let neighbors = this.neighbors(node[0]).filter(neighbor => !visitedNodes.has(neighbor));
      console.log({neighbors});
      for (let neighbor of neighbors) {
        let weight = this.getEdgeValue(node[0], neighbor);
        let sum = cost + weight;
        if (sum < unvisitedNodes[neighbor][0]) {
          console.log(`True for ${neighbor}`);
          unvisitedNodes[neighbor] = [sum, unvisitedNodes[neighbor][1]]
        };
      }
    }

    let path = [valueY];
    let inPath = {valueY:true};
    while (path[path.length-1] !== valueX) {
      let to = path[path.length-1];
      for (let from of this.neighbors(to)) {
        if (inPath[from]) continue;
        let weight = this.getEdgeValue(from, to);
        if (weight && visitedNodes.get(to) - weight === visitedNodes.get(from)) {
          path.push(from);
          inPath[from] = true;
          break;
        }
      } 
    }
    path.push(valueX);
    return path.map(el=>Number(el)).reverse();
  }

  createPlayer() {
    const player = new Player('red', String(Math.random()));
    player.createPlayerDiv($('.maze'))
    $('.player').css('width', `${Math.floor(this.boxSize)}px`)
    $('.player').css('height', `${Math.floor(this.boxSize)}px`)
    console.log(this.players)
    this.players.push(player);
  }

  

}
let newMaze;
newMaze = new Maze(72, 48);
$('.new-maze').on('click', () => {
  newMaze.generateMaze();
  //newMaze.displayMaze();
})
$('.find-dijkstra-path').on('click', ()=>{
  $('.block').css('background-color', 'white');
  $('.block:hover').css('background-color', 'white');
  $(`#${newMaze.start}`).css('background-color', 'orange');
  $(`#${newMaze.end}`).css('background-color', 'green');
  newMaze.showPath(newMaze.start, newMaze.end, 'vdijk');
})
$('.find-Astar-path').on('click', ()=>{
  $('.block').css('background-color', 'white');
  $('.block:hover').css('background-color', 'white');
  $(`#${newMaze.start}`).css('background-color', 'orange');
  $(`#${newMaze.end}`).css('background-color', 'green');
  newMaze.showPath(newMaze.start, newMaze.end, 'vastar');
})
$('.find-bfs-path').on('click', ()=>{
  $('.block').css('background-color', 'white');
  $('.block:hover').css('background-color', 'white');
  $(`#${newMaze.start}`).css('background-color', 'orange');
  $(`#${newMaze.end}`).css('background-color', 'green');
  newMaze.showPath(newMaze.start, newMaze.end, 'vbfs');
})

$('.set-start').on('click', async ()=>{
  $('button').prop('disabled', true);
  newMaze.clicked = null;
  let oldStart = newMaze.start;
  await new Promise(res => $('.maze').on('click', res));
  if (newMaze.clicked !== null) newMaze.start = newMaze.clicked;
  console.log(newMaze.start);
  $('button').prop('disabled', false);
  $(`#${oldStart}`).css('background-color', 'white');
  $(`#${newMaze.start}`).css('background-color', 'orange');
  await newMaze.delay(10);
})

$('.set-end').on('click', async ()=>{
  $('button').prop('disabled', true);
  newMaze.clicked = null;
  let oldEnd = newMaze.end;
  await new Promise(res => $('.maze').on('click', res));
  if (newMaze.clicked !== null) newMaze.end = newMaze.clicked;
  $('button').prop('disabled', false);
  $(`#${oldEnd}`).css('background-color', 'white');
  $(`#${newMaze.end}`).css('background-color', 'green');
  await newMaze.delay(0);
})

$('.zoom-in').on('click', () => {
  newMaze.adjustBoxSize(10);
})
$('.zoom-out').on('click', () => {
  newMaze.adjustBoxSize(-10);
})

$('.createPlayer').on('click', () => {
  console.log('hello')
  newMaze.createPlayer();
})
