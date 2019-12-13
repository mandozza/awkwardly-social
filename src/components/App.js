import React, { Component } from 'react';
import Navbar from './Navbar'
import Main from './Main'
import Web3 from 'web3';
import SocialNetwork from '../abis/SocialNetwork.json'
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
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  }

  async loadBlockchainConnection() {
    const web3 = window.web3
    //Load Account
    const accounts = await web3.eth.getAccounts()
    console.log(accounts,'ACCOUNT')
    this.setState({ account: accounts[0] })
    const networkId = await web3.eth.net.getId()
    console.log(networkId, 'networkid')
    const networkData = SocialNetwork.networks[networkId]
    console.log(networkData, 'Network Data')
    if(networkData) {
      const socialNetwork = web3.eth.Contract(SocialNetwork.abi, networkData.address)
      this.setState({ socialNetwork })
      const postCount = await socialNetwork.methods.postCount().call() 
      console.log(postCount, "postCount")
      this.setState({ postCount })

      //load Posts.
      for( var i = 1; i <= postCount; i++) {
        const post = await socialNetwork.methods.posts(i).call()
        this.setState({
          posts: [...this.state.posts, post]
        })
      }
      // Sort Posts By highest tipped
      this.setState({
        posts: this.state.posts.sort((a,b) => b.tipAmount - a.tipAmount)
      })

      this.setState({ loading: false})
      console.log({ posts: this.state.posts })
    } else {
      window.alert('SocialNetwork contract has not been deployed to the network.')
    }
  }


  createPost(content) {
    console.log('create post')
    this.setState({ loading: true })
    this.state.socialNetwork.methods.createPost(content).send({ from: this.state.account })
    .then(function(receipt){
      console.log('receipt recieved')
      this.setState({ loading: false })
    })
  }

  tipPost(id, tipAmount) {
    console.log('tipping author')
    this.setState({ loading: true })
    this.state.socialNetwork.methods.tipPost(id).send({ from: this.state.account, value: tipAmount })
    .once('recipt', (receipt) => {
      console.log('receipt recieved')
      this.setState({ loading: false })
    })
  }


  constructor(props) {
    super(props)
    this.state = {
      account: '',
      socialNetwork: null,
      postCount: 0,
      posts: [],
      loading: true
    }
    this.createPost = this.createPost.bind(this)
    this.tipPost = this.tipPost.bind(this)
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account}/>
        { this.state.loading 
          ? <div id="loader" className="text-center mt-5"><p>Loading...</p></div>
          : <Main 
               posts={this.state.posts }
               createPost = {this.createPost}
               tipPost = {this.tipPost}
          />
        }
      </div>
    );
  }
}

export default App;
