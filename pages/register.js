import Head from 'next/head'
import React, { Component } from 'react'
import Web3 from 'web3'
//import Link from 'next/link'
import Election from '../build/contracts/Election.json'
import { Button, Form, Segment, Input, TextArea, Select  } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import 'next/router'
// import Loading from './api/Loading'
// import { render } from 'react-dom'



const genderOptions = [
  { key: 'm', text: 'Male', value: 'male' },
  { key: 'f', text: 'Female', value: 'female' },
  { key: 'o', text: 'Other', value: 'other' },
]

export default class Register extends Component {
  
  
  
  async componentDidMount() {
      await this.loadWeb3()
        await this.loadBlockchainData()
      }
      

      
      async loadBlockchainData() {
        const web3 = window.web3;
    
        const accounts = await web3.eth.getAccounts();
        this.setState({ account: accounts[0] });
        const networkId = await web3.eth.net.getId();
        
        
        //Loads Lottery contract
        const electionData = Election.networks[networkId];
        if(electionData){
          
          let election = new web3.eth.Contract(Election.abi, electionData.address);
          this.setState({election});
          
          let manager = await election.methods.manager().call();
          this.setState({manager})
      } else {
        window.alert('Not deployed to network');
      }
      this.setState({loading: false});
    
    }
    
      
      async loadWeb3() {
        if (window.ethereum) {
          window.web3 = new Web3(window.ethereum)
          await window.ethereum.enable()
        }
        else if (window.web3) {
          window.web3 = new Web3(window.web3.currentProvider)
        }
        else {
          window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
      }
    
      constructor(props) {
        super(props)
        this.state = {
          election: {},
          manager: '', 
          loading: true,
          account: '0x0',
          winner: '',
          name:'',
          id: '',
          firstName: '',
          lastName: ''
          
        }
      }

       onSubmit = async (event) => {
        event.preventDefault()

        let f_name = this.state.firstName.concat(" ")
        let l_name = this.state.lastName
        let _name = f_name.concat(l_name)

        this.setState({name: _name})

        await this.state.election.methods.register(this.state.name).send({from: this.state.account})
       
        let status = await this.state.election.methods.voters(this.state.account).call({from: this.state.account})
       // window.alert(status.exists)
       let _id = status.id
       let pass = status.password
       
       this.setState({id: _id, password: pass})
        if (status.exists) {
          window.alert(this.state.id)
          window.alert(this.state.password)
          window.location.href = "./login"
        }
        else{
          window.alert("Error registering")
        }
        };



      
      
      render() {
        return (
          <>
          <Head><title>Register Page</title></Head>
          <Segment basic inverted padded='very' raised size='massive'>
            <h1><b>Register here to continue Voting</b></h1></Segment>
            <Form onSubmit={this.onSubmit}>
    <Form.Group widths='equal'>
      <Form.Field
        id='form-input-control-first-name'
        control={Input}
        label='First name'
        placeholder='First name'
        value={this.state.firstName}
        onChange={event => {this.setState({firstName: event.target.value}) }}
        required
      />
      <Form.Field
        id='form-input-control-last-name'
        control={Input}
        label='Last name'
        placeholder='Last name'
        value={this.state.lastName}
        onChange={event => {this.setState({lastName: event.target.value}) }}
        required
      />
      <Form.Field
        control={Select}
        options={genderOptions}
        label={{ children: 'Gender', htmlFor: 'form-select-control-gender' }}
        placeholder='Gender'
        search
        searchInput={{ id: 'form-select-control-gender' }}
        required
      />
    </Form.Group>
    {/* <Form.Field
      id='form-textarea-control-opinion'
      control={TextArea}
      label='Opinion'
      placeholder='Opinion'
      required
    /> */}
    <Form.Field
      id='form-input-control-error-email'
      control={Input}
      label='Email'
      placeholder='joe@schmoe.com'
      error={{
        content: 'Please enter a valid email address',
        pointing: 'below',
      }}
      required
    />
    <Form.Field 
      id='form-button-control-public'
        control={Button}
      content='Confirm'
      label='Register'
      required
    />
  </Form>
    <h1>{this.state.account}</h1>
          </>
        );
      } 
}