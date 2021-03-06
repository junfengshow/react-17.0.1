const node = document.getElementById('app');
const node2 = document.getElementById('app2');
const { useState, useEffect, Component, clone, createContext } = React;

function extendsFunc (Parent, Child) {
  Child.prototype = new Parent();
  Child.constructor = Child;
}

// 最简单的组件
;(function () {
  // ReactDOM.createRoot(node, {
  //   unstable_concurrentUpdatesByDefault: true
  // }).render(React.createElement('div', null, 'hello'));
})();

// hooks
;(function () {
  const User = () => {
    const [age, setAge] = useState(0);
    const [name, setName] = useState('zhangsan');
    useEffect(() => {
      setTimeout(() => {
        setAge(age + 1);
        setAge(age + 1);
        setAge(age + 1);
      }, 3000)
    }, [])
    return React.createElement('div', {
      onClick: () => {
        setAge(age + 1)
        setName(name)
      }
    }, `user: ${age};name: ${name}`)
  }
  // ReactDOM.createRoot(node, {
  //   unstable_concurrentUpdatesByDefault: true
  // }).render(React.createElement(User, null));
})();

// class
;(function () {
  class User extends Component {
    constructor (props) {
      super(props);
      this.state = {
        name: 'zhangsan',
        age: 0,
        friend: {
          b: 1
        }
      }
    }
    componentDidMount () {
      document.getElementById('oDiv').addEventListener('click', () => {
        this.setState({ age: this.state.age + 1 });
        this.setState({ age: this.state.age + 1 });
        this.setState({ age: this.state.age + 1 });
      })
      this.setState({
        friend: {
          a: 2
        }
      }, () => {
        console.log(this.state);
      })
    }
    onClick = () => {
      setTimeout(() => {
        this.setState({ age: this.state.age + 1 });
        this.setState({ age: this.state.age + 1 });
        this.setState({ age: this.state.age + 1 });
      })
    }
    render () {
      return (
        React.createElement('div', {
          id: 'oDiv',
          // onClick: this.onClick
        }, `user: ${this.state.age};name: ${this.state.name}`)
      )
    }
  }
  ReactDOM.createRoot(node, {
    unstable_concurrentUpdatesByDefault: false
  }).render(React.createElement(User));
})();
 