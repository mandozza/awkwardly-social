import React, { Component } from 'react';
import Navbar from './Navbar'
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
    console.log(accounts)
    this.setState({ account: accounts[0] })
    const networkId = await web3.eth.net.getId()
    console.log(networkId, 'networkid')
    const networkData = SocialNetwork.networks[networkId]
    console.log(networkData)
    if(networkData) {
      const socialNetwork = web3.eth.Contract(SocialNetwork.abi, networkData.address)
      this.setState({ socialNetwork })
      const postCount = await socialNetwork.methods.postCount().call() 
      console.log(postCount)
      this.setState({ postCount })

      //load Posts.
      for( var i = 1; i <= postCount; i++) {
        const post = await socialNetwork.methods.posts(i).call()
        this.setState({
          posts: [...this.state.posts, post]
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
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '500px' }}>
              <div className="content mr-auto ml-auto">
                  { this.state.posts.map((post,key) => {
                      return (
                        <div className="card mb-4" key={key} >
                            <div className="card-header">
                              <small className="text-muted">{post.author}</small>
                            </div>
                            <ul id="postList" className="list-group list-group-flush">
                                <li className="list-group-item">
                                  <p>{post.content}</p>
                                </li>
                                <li key={key} className="list-group-item py-2">
                                    <small className="float-left mt-1 text-muted">
                                      Tips: { window.web3.utils.fromWei(post.tipAmount.toString(), 'ether')} ETH
                                    </small>
                                    <button className="btn btn-link btn-sm float-right pt-0">
                                      <span>TIP 0.1 ETH</span>
                                    </button>
                                </li>
                            </ul>
                        </div>
                      )
                  })}
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
