import React, { Component } from 'react';
import Navbar from './Navbar'
import Web3 from 'web3';
import logo from '../logo.png';
import SocialNetwork from '..abis/SocialNetwork.json'
import './App.css';

class App extends Component {

  // On mount contect to ethereum
  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainConnection()
  } 

// Connect to Ethereum
  async loadWeb3(){
    if(window.ethereum){
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You shiould consider trying MetaMask!');
    }
  }

  async loadBlockchainConnection() {
    const web3 = window.web3
    //Load Account
    const accounts = await web3.eth.getAccounts()
    console.log(accounts)
    this.setState({ account: accounts[0] })
    const networkId = await web3.eth.net.getId()
    const networkData = SocialNetwork.networks[networkId]
    if(networkData) {
      const socialNetwork = web3.eth.Contract(SocialNetwork.abi, networkData.address)
      this.setState({ socialNetwork })
      const postCount = await socialNetwork.methods.postCount().call() 
      this.setState({ postCount })

      //load Posts.
      for( var i = 1; i <= postCount; i++) {
        const post = await socialNetwork.methods.post(i).call()
        this.setState({
          posts: [...this.state.posts,post]
        })
      }
      console.log({ posts: this.state.posts })
    } else {
      window.alert('SocialNetwork contract has not been deployed to the network.')
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      socialNetwork: null,
      postCount: 0,
      posts: []
    }
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account}/>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <a
                  href="http://www.awkwardlysocial.io"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={logo} className="App-logo" alt="logo" />
                </a>
                <h1>Awkwardly Social</h1>
                <p>
                  Edit <code>src/components/App.js</code> and save to reload.
                </p>
                <a
                  className="App-link"
                  href="http://www.awkwardlysocial.io"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LEARN BLOCKCHAIN <u><b>NOW! </b></u>
                </a>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
